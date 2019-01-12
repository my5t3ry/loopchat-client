"use strict";

const UIsynths = new Map();

export class  UIsynthsAddSynthControler {

      UIsynthsAddSynth(id, obj) {
        const syn = DOM.synth.cloneNode(true);

        syn.dataset.id = id;
        UIsynths.set(id, syn);
          this.UIsynthsNameSynth(id, obj.name);
        DOM.patterns.prepend(syn);
    }

      UIsynthsExpandSynth(id, b) {
        UIsynths.get(id).export.classList.toggle("synth-show", b);
    }

      UIsynthsNameSynth(id, name) {
        UIsynths.get(id).querySelector(".synth-name").textContent = name;
    }

      UIsynthsInit() {
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
                this.UIsynthsExpandSynth(id, true);
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
            if (e.target.export.classList.contains("synth-name")) {
                this.UIsynthsExpandSynth(e.target.closest(".synth").dataset.id);
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
