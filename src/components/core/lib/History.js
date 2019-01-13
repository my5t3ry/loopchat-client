"use strict";

export default  class History {
    constructor(daw) {
        this.daw = daw;
        this._stack = [];
        this._stackInd = 0;
        this._stackCue = -1;
        "use strict";
        this.prototype ={};

        this.prototype.nameAction = function (act) {
            const cmp = this.daw.get.composition(),
                r = act.redo,
                u = act.undo;

            if ("bpm" in r) {
                return {i: "clock", t: `BPM: ${r.bpm}`};
            }
            if ("name" in r) {
                return {i: "name", t: `Name: "${r.name}"`};
            }
            if ("loopA" in r) {
                return {i: "loop", t: `Loop: ${r.loopA} -> ${r.loopB}`};
            }
            if (r.beatsPerMeasure || r.stepsPerBeat) {
                return {i: "clock", t: `Time signature: ${cmp.beatsPerMeasure}/${cmp.stepsPerBeat}`};
            }
            return (
                this._nameAction_synth(cmp, r, u) ||
                this._nameAction_pattern(cmp, r, u) ||
                this._nameAction_tracks(cmp, r, u) ||
                this._nameAction_blocks(cmp, r, u) ||
                this._nameAction_keys(cmp, r, u) ||
                {i: "", t: ""}
            );
        };

        this._nameAction_synth = function (cmp, r, u) {
            if (r.synths) {
                const synthId = Object.keys(r.synths)[0],
                    rSyn = r.synths[synthId],
                    uSyn = u.synths[synthId];

                if (!rSyn || !uSyn) {
                    return rSyn
                        ? {i: "add", t: `New synthesizer "${rSyn.name}"`}
                        : {i: "remove", t: `Remove synthesizer "${uSyn.name}"`};
                }
                if ("name" in rSyn) {
                    return {i: "name", t: `${uSyn.name}: rename to "${rSyn.name}"`};
                }
                if (rSyn.oscillators) {
                    const idOsc = Object.keys(rSyn.oscillators)[0],
                        rOsc = rSyn.oscillators[idOsc],
                        uOsc = uSyn.oscillators[idOsc],
                        msg = cmp.synths[synthId].name + ": ";
                    let param;

                    if (!rOsc || !uOsc) {
                        return rOsc
                            ? {i: "add", t: msg + "New oscillator"}
                            : {i: "remove", t: msg + "Remove oscillator"};
                    }
                    param = Object.entries(rOsc)[0];
                    return {i: "param", t: msg + `set ${param[0]} to "${param[1]}"`};
                }
                if (rSyn.envelopes) {
                    const [envName, env] = Object.entries(rSyn.envelopes)[0],
                        attRel = Object.keys(env)[0];

                    return {
                        i: "envelope",
                        t: cmp.synths[synthId].name + `: change ${envName} ${attRel} envelope`,
                    };
                }
            }
        }
        this._nameAction_blocks = function (cmp, r, u) {
            const rBlcs = r.blocks;

            for (const id in rBlcs) {
                const arrK = Object.keys(rBlcs),
                    msg = " " + arrK.length + " block" + (arrK.length > 1 ? "s" : ""),
                    rBlc = rBlcs[id];

                if (!rBlc) {
                    return {i: "erase", t: "Remove" + msg};
                }
                if (!u.blocks[id]) {
                    return {i: "paint", t: "Add" + msg};
                }
                if ("duration" in rBlc) {
                    return {i: "crop", t: "Crop" + msg};
                }
                if ("when" in rBlc || "track" in rBlc) {
                    return {i: "move", t: "Move" + msg};
                }
                if ("selected" in rBlc) {
                    return rBlc.selected
                        ? {i: "selection ico--plus", t: "Select" + msg}
                        : {i: "selection ico--minus", t: "Unselect" + msg};
                }
            }
        }
        this._nameAction_tracks = function (cmp, r, u) {
            const o = r.tracks;

            if (o) {
                let a, i = 0;

                for (a in o) {
                    if (o[a].name) {
                        return {i: "name", t: `Name track: "${u.tracks[a].name}" -> "${o[a].name}"`}
                    }
                    if (i++) {
                        break;
                    }
                }
                return i > 1
                    ? {i: "unmute", t: `Un/mute several tracks`}
                    : {
                        i: o[a].toggle ? "unmute" : "mute",
                        t: (o[a].toggle ? "Unmute" : "Mute") + ` "${cmp.tracks[a].name}" track`
                    }
            }
        }
        this._nameAction_pattern = function (cmp, r, u) {
            for (const id in r.patterns) {
                const pat = cmp.patterns[id],
                    rpat = r.patterns[id],
                    upat = u.patterns[id];

                if (!rpat || !upat) {
                    return rpat
                        ? {i: "add", t: `New pattern "${rpat.name}"`}
                        : {i: "remove", t: `Remove pattern "${upat.name}"`};
                }
                if (rpat.synth) {
                    return {i: "param", t: `${pat.name}: change its synthesizer`};
                }
                if ("name" in rpat) {
                    return {i: "name", t: `${upat.name}: rename to "${rpat.name}"`};
                }
            }
        }
        this._nameAction_keys = function (cmp, r, u) {
            for (const a in r.keys) {
                const o = r.keys[a];

                for (const b in o) {
                    const arrK = Object.keys(o),
                        msgPat = cmp.patterns[cmp.patternOpened].name + ": ",
                        msgSmp = " " + arrK.length + " key" + (arrK.length > 1 ? "s" : ""),
                        oB = o[b];

                    return (
                        (!oB && {i: "erase", t: msgPat + "remove" + msgSmp}) ||
                        (!u.keys[a][b] && {i: "paint", t: msgPat + "add" + msgSmp}) ||
                        ("duration" in oB && {i: "crop", t: msgPat + "crop" + msgSmp}) ||
                        ("gain" in oB && {i: "param", t: msgPat + "edit gain of" + msgSmp}) ||
                        ("pan" in oB && {i: "param", t: msgPat + "edit pan of" + msgSmp}) ||
                        (("when" in oB || "key" in oB) && {i: "move", t: msgPat + "move" + msgSmp}) ||
                        ("selected" in oB && (oB.selected
                                ? {i: "selection ico--plus", t: msgPat + "select" + msgSmp}
                                : {i: "selection ico--minus", t: msgPat + "unselect" + msgSmp}
                        ))
                    );
                }
            }
        }

    }

    empty() {
        const stack = this._stack;

        while (stack.length) {
            this.daw._call("historyDeleteAction", stack.pop());
        }
        this._stackInd = 0;
    }

    stackChange(obj) {
        const stack = this._stack,
            act = {
                redo: obj,
                undo: DAWCoreBuilder.composeUndo(this.daw.composition.cmp, obj),
            },
            desc = this.nameAction(act);

        act.desc = desc.t;
        act.icon = desc.i;
        while (stack.length > this._stackInd) {
            this.daw._call("historyDeleteAction", stack.pop());
        }
        ++this._stackInd;
        act.index = stack.push(act);
        this._change(act, "redo", "historyAddAction");
    }

    getCurrentAction() {
        return this._stack[this._stackInd - 1] || null;
    }

    goToAction(act) {
        let n = act.index - this._stackInd;

        if (n < 0) {
            while (n++ < 0) {
                this.undo();
            }
        } else if (n > 0) {
            while (n-- > 0) {
                this.redo();
            }
        }
        return false;
    }

    undo() {
        return this._stackInd > 0
            ? this._change(this._stack[--this._stackInd], "undo", "historyUndo")
            : false;
    }

    redo() {
        return this._stackInd < this._stack.length
            ? this._change(this._stack[this._stackInd++], "redo", "historyRedo")
            : false;
    }

    // private:
    _change(act, undoredo, cbStr) {
        const obj = act[undoredo],
            prevObj = act[undoredo === "undo" ? "redo" : "undo"];

        this.daw._call(cbStr, act);
        this.daw.composition.change(obj, prevObj);
        return obj;
    }
};
