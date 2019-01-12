"use strict";

const UIsynths = new Map();

class UIsynthsAddSynthControler {

    static UIsynthsAddSynth(id, obj) {
        const syn = DOM.synth.cloneNode(true);

        syn.dataset.id = id;
        UIsynths.set(id, syn);
       UIsynthsAddSynthControler.UIsynthsNameSynth(id, obj.name);
        DOM.patterns.prepend(syn);
    }

    static UIsynthsExpandSynth(id, b) {
        UIsynths.get(id).classList.toggle("synth-show", b);
    }

    static UIsynthsNameSynth(id, name) {
        UIsynths.get(id).querySelector(".synth-name").textContent = name;
    }

    static UIsynthsInit() {
        const fnClick = new Map([
            [undefined, id => {
                DAW.openSynth(id);
            }],
            ["expand", id => {
                UIsynthsExpandSynth(id);
            }],
            ["delete", id => {
                if (Object.keys(DAW.get.synths()).length > 1) {
                    DAW.removeSynth(id);
                } else {
                    gsuiPopup.alert("Error", "You can not delete the last synthesizer");
                }
            }],
            ["newPattern", id => {
                DAW.newPattern(id);
                UIsynthsAddSynthControler.UIsynthsExpandSynth(id, true);
            }],
        ]);

        DOM.synthNew.onclick = () => (DAW.newSynth(), false);
        DOM.patterns.ondrop = e => {
            const syn = e.target.closest(".synth");

            if (syn) {
                const arr = e.dataTransfer.getData("text").split(":");

                if (arr.length === 2) {
                    DAW.changePatternSynth(arr[0], syn.dataset.id);
                }
            }
        };
        DOM.patterns.addEventListener("dblclick", e => {
            if (e.target.classList.contains("synth-name")) {
                UIsynthsAddSynthControler.UIsynthsExpandSynth(e.target.closest(".synth").dataset.id);
            }
        });
        DOM.patterns.addEventListener("click", e => {
            const tar = e.target,
                pat = tar.closest(".pattern"),
                syn = !pat && tar.closest(".synth");

            if (syn) {
                fnClick.get(tar.dataset.action)(syn.dataset.id);
            }
        });
    }

}
