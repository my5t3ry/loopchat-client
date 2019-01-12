"use strict";
import gswaScheduler from '../gs-wa/gswaScheduler/gswaScheduler'

export default class Composition {

    constructor(daw) {
        const sch = new gswaScheduler();
        this.prototype = {};
        this.prototype.change = function (obj, prevObj) {
            const cmp = this.cmp,
                act = this.daw.history.getCurrentAction(),
                saved = act === this._actionSavedOn && !!cmp.savedAt;

            DAWCore.objectDeepAssign(cmp, obj);
            this.change.fn.forEach((fn, attr) => {
                if (typeof attr === "string") {
                    if (attr in obj) {
                        fn.call(this, obj, prevObj);
                    }
                } else if (attr.some(attr => attr in obj)) {
                    fn.call(this, obj, prevObj);
                }
            });

            if (saved !== this._saved) {
                this._saved = saved;
                this.daw._call("compositionSavedStatus", cmp, saved);
            }
            this.daw._call("compositionChanged", obj, prevObj);
            return obj;
        };

        this.prototype.fn = new Map([
            ["bpm", function ({bpm}) {
                this._sched.setBPM(bpm);
                this._synths.forEach(syn => syn.setBPM(bpm));
                this.daw.pianoroll.setBPM(bpm);
            }],
            [["loopA", "loopB"], function () {
                if (this.daw.compositionFocused) {
                    const get = this.daw.get;

                    this._sched.setLoopBeat(
                        get.loopA() || 0,
                        get.loopB() || get.duration() || get.beatsPerMeasure());
                }
            }],
            ["blocks", function ({blocks}) {
                this.assignBlocksChange(blocks);
            }],
            ["synths", function ({synths}, {synths: prevSynths}) {
                Object.entries(synths).forEach(([id, synthObj]) => {
                    if (!synthObj) {
                        this._synths.get(id).stopAllKeys();
                        this._synths.delete(id);
                    } else if (!prevSynths[id]) {
                        const syn = new gswaSynth();

                        syn.setContext(this.daw.get.ctx());
                        syn.setBPM(this.daw.get.bpm());
                        syn.connect(this.daw.get.destination());
                        DAWCore.objectDeepAssign(syn.data, synthObj);
                        this._synths.set(id, syn);
                    } else {
                        DAWCore.objectDeepAssign(this._synths.get(id).data, synthObj);
                    }
                });
            }],
            ["keys", function ({keys, patterns}) {
                const pats = Object.entries(this.cmp.patterns),
                    patOpened = this.cmp.patternOpened;

                Object.entries(keys).forEach(([keysId, keysObj]) => {
                    pats.some(([patId, patObj]) => {
                        if (patObj.keys === keysId) {
                            this.assignPatternChange(patObj, keysObj);
                            if (patId === patOpened) {
                                this.daw.pianoroll.change(patterns && patterns[patId], keysObj);
                            }
                            return true;
                        }
                    });
                });
            }],
            ["patternOpened", function (obj) {
                this.daw.pianoroll.openPattern(obj.patternOpened);
            }],
            ["synthOpened", function (obj) {
                this.daw.pianoroll.setSynth(obj.synthOpened);
            }],
        ]);


        this.daw = daw;
        this.cmp = null;
        this.loaded =
            this.playing = false;
        this._saved = true;
        this._sched = sch;
        this._synths = new Map();
        this._startedSched = new Map();
        this._startedKeys = new Map();
        this._actionSavedOn = null;

        this.epure = function (cmp) {
            if (cmp.loopA == null || cmp.loopB == null) {
                delete cmp.loopA;
                delete cmp.loopB;
            }
            Object.values(cmp.tracks).forEach(tr => {
                if (!tr.name) {
                    delete tr.name;
                }
                if (tr.toggle) {
                    delete tr.toggle;
                }
            });
            Object.values(cmp.blocks).forEach(blc => {
                if (!blc.offset) {
                    delete blc.offset;
                }
                if (!blc.selected) {
                    delete blc.selected;
                }
                if (!blc.durationEdited) {
                    delete blc.durationEdited;
                }
            });
            Object.values(cmp.keys).forEach(keys => (
                Object.values(keys).forEach(key => {
                    if (!key.offset) {
                        delete key.offset;
                    }
                    if (!key.selected) {
                        delete key.selected;
                    }
                    if (key.prev == null) {
                        delete key.prev;
                    }
                    if (key.next == null) {
                        delete key.next;
                    }
                })
            ));
            return cmp;
        };
        sch.currentTime = () => this.ctx.currentTime;
        sch.ondatastart = this._onstartBlock.bind(this);
        sch.ondatastop = this._onstopBlock.bind(this);
    }

    // un/load, change, save
    // ........................................................................
    setCtx(ctx) {
        this.ctx = ctx;
        this._synths.forEach(syn => {
            syn.setContext(ctx);
            syn.connect(this.daw.get.destination());
        });
    }

    load(cmpOri) {
        return new Promise((res, rej) => {
            const cmp = DAWCore.objectDeepCopy(cmpOri);

            if (DAWCore.Composition.format(cmp)) {
                this.unload();
                res(cmp);
            } else {
                rej();
            }
        }).then(cmp => {
            const opts = this.daw.compositionsOptions.get(cmp.id);

            this.cmp = cmp;
            this.loaded = true;
            this.change(cmp, {
                keys: {},
                synths: {},
                patterns: {},
                blocks: {},
            });
            this._actionSavedOn = null;
            this._saved = !opts.localSaving || DAWCore.LocalStorage.has(cmp.id) || !cmp.savedAt;
            this.daw._call("compositionSavedStatus", cmp, this._saved);
            return cmp;
        });
    }

    unload() {
        if (this.loaded) {
            const d = this._sched.data;

            this.loaded = false;
            this._sched.stop();
            Object.keys(d).forEach(id => delete d[id]);
            this._synths.clear();
            this._saved = true;
            this.daw._call("compositionSavedStatus", this.cmp, true);
            this.cmp = null;
        }
    }

    save() {
        if (!this._saved) {
            this._saved = true;
            this._actionSavedOn = this.daw.history.getCurrentAction();
            this.cmp.savedAt = Math.floor(Date.now() / 1000);
            return true;
        }
    }

    // controls
    // ........................................................................
    getSynth(id) {
        return this._synths.get(id);
    }

    getCurrentTime() {
        return this._sched.getCurrentOffsetBeat();
    }

    setCurrentTime(t) {
        this._sched.setCurrentOffsetBeat(t);
        this.daw._call("currentTime", this.getCurrentTime(), "composition");
        this.daw._clockUpdate();
    }

    play() {
        if (!this.playing) {
            this.playing = true;
            this._start(this.getCurrentTime());
        }
    }

    pause() {
        if (this.playing) {
            this.playing = false;
            this._sched.stop();
        }
    }

    stop() {
        if (this.playing) {
            this.pause();
            this.setCurrentTime(this.cmp.loopA || 0);
        } else {
            this.setCurrentTime(0);
        }
    }

    // ........................................................................
    _setLoop(a, b) {
        if (!Number.isFinite(a)) {
            this._sched.setLoopBeat(0, this.cmp.duration || this.cmp.beatsPerMeasure);
        } else {
            this._sched.setLoopBeat(a, b);
        }
    }

    _start(offset) {
        const sch = this._sched;

        if (this.ctx instanceof OfflineAudioContext) {
            sch.clearLoop();
            sch.enableStreaming(false);
            sch.startBeat(0);
        } else {
            this._setLoop(this.cmp.loopA, this.cmp.loopB);
            sch.enableStreaming(true);
            sch.startBeat(0, offset);
        }
    }

    // ........................................................................
    assignBlocksChange(data) {
        const cmp = this.cmp;

        DAWCore.objectDeepAssign(this._sched.data, data);
        if (cmp.loopA === false) {
            this._sched.setLoopBeat(0, cmp.duration || cmp.beatsPerMeasure);
        }
    }

    assignPatternChange(pat, keys) {
        this._startedSched.forEach(sch => {
            if (sch.pattern === pat) {
                DAWCore.objectDeepAssign(sch.data, keys);
            }
        });
    }

    // ........................................................................
    _onstartBlock(startedId, blcs, when, off, dur) {
        const cmp = this.cmp,
            blc = blcs[0][1];

        if (cmp.tracks[blc.track].toggle) {
            const pat = cmp.patterns[blc.pattern],
                sch = new gswaScheduler();

            this._startedSched.set(startedId, sch);
            sch.pattern = pat;
            sch.currentTime = this._sched.currentTime;
            sch.ondatastart = this._onstartKey.bind(this, pat.synth);
            sch.ondatastop = this._onstopKey.bind(this, pat.synth);
            sch.setBPM(cmp.bpm);
            Object.assign(sch.data, cmp.keys[pat.keys]);
            if (this.ctx instanceof OfflineAudioContext) {
                sch.enableStreaming(false);
            }
            sch.start(when, off, dur);
        }
    }

    _onstopBlock(startedId) {
        const sch = this._startedSched.get(startedId);

        if (sch) {
            sch.stop();
            this._startedSched.delete(startedId);
        }
    }

    _onstartKey(synthId, startedId, blcs, when, off, dur) {
        this._startedKeys.set(startedId,
            this._synths.get(synthId).startKey(blcs, when, off, dur));
    }

    _onstopKey(synthId, startedId) {
        this._synths.get(synthId).stopKey(this._startedKeys.get(startedId));
        this._startedKeys.delete(startedId);
    }

    format = function (cmp) {
        const blcsEntries = Object.entries(cmp.blocks),
            blcsObj = {},
            sortWhen = (a, b) => {
                const c = a[1].when,
                    d = b[1].when;

                return c < d ? -1 : c > d ? 1 : 0;
            };
        let blcId = 0;

        // loopA/B
        // ..........................................
        if (Number.isFinite(cmp.loopA) && Number.isFinite(cmp.loopB)) {
            cmp.loopA = Math.max(0, cmp.loopA);
            cmp.loopB = Math.max(0, cmp.loopB);
            if (cmp.loopA === cmp.loopB) {
                cmp.loopA =
                    cmp.loopB = null;
            }
        } else {
            cmp.loopA =
                cmp.loopB = null;
        }

        // ..........................................
        if (!cmp.synths) {
            const synthId = 0;

            Object.values(cmp.patterns).forEach(pat => pat.synth = 0);
            cmp.synthOpened = 0;
            cmp.synths = {
                0: {
                    name: "synth",
                    oscillators: {0: {type: "sine", detune: 0, pan: 0, gain: 1}},
                }
            };
        }
        Object.values(cmp.synths).forEach(syn => {
            delete syn.envelopes;
        });
        Object.values(cmp.tracks).reduce((order, tr) => {
            tr.name = typeof tr.name === "string" ? tr.name : "";
            tr.order = typeof tr.order === "number" ? tr.order : order;
            tr.toggle = typeof tr.toggle === "boolean" ? tr.toggle : true;
            return tr.order + 1;
        }, 0);
        cmp.blocks = blcsObj;
        blcsEntries.sort(sortWhen);
        blcsEntries.forEach(([id, blc]) => {
            blcsObj[blcId++] = blc;
            blc.offset = blc.offset || 0;
            blc.selected = !!blc.selected;
            blc.durationEdited = !!blc.durationEdited;
        });
        Object.values(cmp.keys).forEach(keys => {
            Object.values(keys).forEach(k => {
                k.pan = +DAWCore.castToNumber(-1, 1, 0, k.pan).toFixed(2);
                k.gain = +DAWCore.castToNumber(0, 1, .8, k.gain).toFixed(2);
                k.selected = !!k.selected;
                if (k.prev == null) {
                    k.prev = null;
                }
                if (k.next == null) {
                    k.next = null;
                }
                delete k.durationEdited;
                if (typeof k.key === "string") {
                    if (window.gsuiKeys) {
                        k.key = window.gsuiKeys.keyStrToMidi(k.key);
                    } else {
                        console.warn("DAWCore.Composition.format: gsuiKeys is needed to convert an old midi notation");
                        return false;
                    }
                }
            });
        });
        return true;
    };


};
