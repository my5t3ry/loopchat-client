"use strict";


export class  UIsynthOpenController {


      UIsynthOpen(id) {
        const  UIsynth = new gsuiSynthesizer();

        UIsynth.empty();
        if (!id) {
            DOM.synthName.textContent = "";
        } else {
            const syn = DAW.get.synth(id);

            DOM.synthName.textContent = syn.name;
            this.UIsynthChange(syn);
        }
    }

      UIsynthChange(obj) {
        if ("name" in obj) {
            DOM.synthName.textContent = obj.name;
        }
        UIsynth.change(obj);
    }

      UIsynthInit() {
        UIsynth.oninput = (id, attr, val) => {
            DAW.liveChangeSynth(DAW.get.synthOpened(), {
                oscillators: {[id]: {[attr]: val}}
            });
        };                                                 
        UIsynth.onchange = obj => {
            DAW.compositionChange({
                synths: {
                    [DAW.get.synthOpened()]: obj
                }
            });
        };
        UIsynth.setWaveList(Array.from(gswaPeriodicWaves.keys()));
        DOM.synthName.onclick = () => {
            const id = DAW.get.synthOpened(),
                name = DOM.synthName.textContent;

            gsuiPopup.prompt("Rename synthesizer", "", name, "Rename")
                .then(name => DAW.nameSynth(id, name));
        };
        DOM.synthWrapper2.append(UIsynth.rootElement);
        UIsynth.attached();
    }


}