"use strict";

import Composition from "../lib/Composition";
import LocalStorage from "../lib/LocalStorage";
import Pianoroll from "../lib/Pianoroll";
import Destionation from "../lib/Destination";
import History from "../lib/History";

export default class DAWCoreBuilder {
    constructor() {
        this.cb = {};
        DAWCoreBuilder.Compositon = Composition;
        DAWCoreBuilder.History = History;
        DAWCoreBuilder.Pianoroll = Pianoroll;
        DAWCoreBuilder.LocalStorage = LocalStorage;
        this.json = {};
        this.env = Object.seal({
            def_bpm: 120,
            def_appGain: .5,
            def_nbTracks: 21,
            def_stepsPerBeat: 4,
            def_beatsPerMeasure: 4,
            analyserFFTsize: 1024,
            analyserEnable: true,
            sampleRate: 44100,
            clockSteps: false,
        });

        this.json.composition = (env, id) => {
            const tracks = {};

            for (let i = 0; i < env.def_nbTracks; ++i) {
                tracks[i] = {};
            }
            return {
                id,
                bpm: env.def_bpm,
                stepsPerBeat: env.def_stepsPerBeat,
                beatsPerMeasure: env.def_beatsPerMeasure,
                name: "",
                duration: 0,
                loopA: false,
                loopB: false,
                synthOpened: "0",
                patternOpened: "0",
                patterns: {
                    "0": {
                        name: "pat",
                        type: "keys",
                        keys: "0",
                        synth: "0",
                        duration: env.def_beatsPerMeasure
                    }
                },
                tracks,
                blocks: {},
                synths: {"0": DAWCoreBuilder.json.synth("synth")},
                keys: {"0": {}},
            };
        };
        this.json.synth = name => ({
            name,
            oscillators: {
                "0": {
                    order: 0,
                    type: "sine",
                    detune: 0,
                    pan: 0,
                    gain: 1,
                }
            },
        });

        this.pianoroll = null;
        this.compositionFocused = true;
        this.compositionsOptions = new Map();
        this.compositions = new Map();
        this.composition = new Composition(this);
        this.destination = new Destionation(this);
        this.history = new History(this);
        this._loop = this._loop.bind(this);
        this._getInit();
        this.setCtx(new AudioContext());
    }

    setCtx(ctx) {
        this.ctx = ctx;
        this.destination.setCtx(ctx);
        this.composition.setCtx(ctx);
    }

    initPianoroll() {
        this.pianoroll = new DAWCoreBuilder.Pianoroll(this);
    }

    _getInit() {
        const listnames = ["synth", "pattern", "block", "track", "keys"],
            cmp = () => this.composition.cmp,
            getList = list => cmp() && cmp()[list],
            getObject = (list, id) => cmp() && cmp()[list][id],
            obj = listnames.reduce((obj, w) => {
                if (w.endsWith("s")) {
                    obj[w] = this._getListOrObj.bind(this, w);
                } else {
                    const list = w + "s";

                    obj[w] = getObject.bind(this, list);
                    obj[list] = getList.bind(this, list);
                }
                return obj;
            }, {});

        this.get = obj;
        this._getList = getList;
        obj.composition = id => (
            !id || id === obj.id()
                ? cmp()
                : this.compositions.get(id)
        );
        obj.id = () => cmp() && cmp().id;
        obj.bpm = () => cmp() && cmp().bpm;
        obj.name = () => cmp() && cmp().name;
        obj.loopA = () => cmp() && cmp().loopA;
        obj.loopB = () => cmp() && cmp().loopB;
        obj.duration = () => cmp() && cmp().duration;
        obj.synthOpened = () => cmp() && cmp().synthOpened;
        obj.patternOpened = () => cmp() && cmp().patternOpened;
        obj.beatsPerMeasure = () => cmp() && cmp().beatsPerMeasure;
        obj.stepsPerBeat = () => cmp() && cmp().stepsPerBeat;
        obj.ctx = () => this.ctx;
        obj.currentTime = () => this.composition.currentTime;
        obj.destination = () => this.destination.getDestination();
    }

    _getListOrObj(listname, id) {
        const list = this._getList(listname);

        return list && arguments.length === 2 ? list[id] : list;
    }a

    envChange(obj) {
        Object.assign(this.env, obj);
        if ("clockSteps" in obj) {
            this._clockUpdate();
        }
    }

    compositionChange(obj) {
        this.history.stackChange(obj);
    }

    compositionNeedSave() {
        return !this.composition._saved;
    }

    compositionFocus(force) {
        if (!this.compositionFocused) {
            this._focusOn(true, force);
        }
    }

    pianorollFocus(force) {
        if (this.compositionFocused && this.pianoroll && this.get.patternOpened()) {
            this._focusOn(false, force);
        }
    }

    isPlaying() {
        return this.composition.playing ||
            (this.pianoroll ? this.pianoroll.playing : false);
    }

    togglePlay() {
        this.isPlaying() ? this.pause() : this.play();
    }

    play() {
        this._focusedObj().play();
        this._call("play", this._focused());
    }

    pause() {
        this._focusedObj().pause();
        this._call("pause", this._focused());
        this._clockUpdate();
    }

    stop() {
        const obj = this._focusedObj();

        obj.stop();
        this._call("stop", this._focused());
        this._call("currentTime", obj.getCurrentTime(), this._focused());
        this._clockUpdate();
    }

    // private:
    _startLoop() {
        this._clockUpdate();
        this._loop();
    }

    _stopLoop() {
        cancelAnimationFrame(this._frameId);
    }

    _loop() {
        const anData = this.destination.analyserFillData();

        if (anData) {
            this._call("analyserFilled", anData);
        }
        if (this.isPlaying()) {
            const beat = this._focusedObj().getCurrentTime();

            this._call("currentTime", beat, this._focused());
            this._clockUpdate();
        }
        this._frameId = requestAnimationFrame(this._loop);
    }

    _clockUpdate() {
        const t = DAWCoreBuilder.time,
            beat = this._focusedObj().getCurrentTime();

        if (this.env.clockSteps) {
            const sPB = this.get.stepsPerBeat();

            this._call("clockUpdate",
                t.beatToBeat(beat),
                t.beatToStep(beat, sPB),
                t.beatToMStep(beat, sPB));
        } else {
            const sec = beat * 60 / this.get.bpm();

            this._call("clockUpdate",
                t.secToMin(sec),
                t.secToSec(sec),
                t.secToMs(sec));
        }
    }

    _focused() {
        return this.compositionFocused ? "composition" : "pianoroll";
    }

    _focusedObj() {
        return this.compositionFocused ? this.composition : this.pianoroll;
    }

    _focusOn(cmpFocused, force) {
        if (force === "-f" || !this.isPlaying()) {
            this.pause();
            this.compositionFocused = cmpFocused;
            this._call("focusOn", "composition", cmpFocused);
            this._call("focusOn", "pianoroll", !cmpFocused);
            this._clockUpdate();
        }
    }

    _call(cbName, a, b, c, d) {
        const fn = this.cb[cbName];

        return fn && fn(a, b, c, d);
    }

    _error(fnName, collection, id) {
        return !this.get.composition()
            ? `DAWCoreBuilder.${fnName}: cmp is not defined`
            : `DAWCoreBuilder.${fnName}: cmp.${collection}[${id}] is not defined`;
    }

    _getNextIdOf(obj) {
        return Object.keys(obj).reduce((max, id) => (
            Math.max(max, parseInt(id) || 0)
        ), 0) + 1 + "";
    }

    _createUniqueName(collection, name) {
        return DAWCoreBuilder.uniqueName(name, Object.values(
            this.get[collection]()).map(obj => obj.name));
    }
}


