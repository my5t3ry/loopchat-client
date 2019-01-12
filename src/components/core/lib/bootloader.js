import DAWCore, {Composition, LocalStorage, Pianoroll} from '../core'

class bootloader {
    bootstrap() {
        DAWCore.Compositon = new Composition();
        DAWCore.History = new History();
        DAWCore.Pianoroll = new Pianoroll();
        DAWCore.LocalStorage = new LocalStorage();
        const DAW = new DAWCore(),
            hash = new Map(location.hash
                .substr(1)
                .split("&")
                .map(kv => kv.split("="))
            );

        gswaPeriodicWaves.forEach((w, name) => (
            gsuiPeriodicWave.addWave(name, w.real, w.imag)
        ));

        window.DAW = DAW;
        window.VERSION = "0.19.0";

        DAW.initPianoroll();

        window.onkeyup = UIkeyboardUp;
        window.onkeydown = UIkeyboardDown;
        window.onbeforeunload = UIcompositionBeforeUnload;
        document.body.ondrop = UIdrop;
        document.body.ondragover = () => false;

        DAW.cb.focusOn = UIcontrolsFocusOn;
        DAW.cb.currentTime = UIcontrolsCurrentTime;
        DAW.cb.clockUpdate = UIcontrolsClockUpdate;
        DAW.cb.compositionOpened = UIcompositionOpened;
        DAW.cb.compositionClosed = UIcompositionClosed;
        DAW.cb.compositionChanged = UIcompositionChanged;
        DAW.cb.compositionDeleted = UIcompositionDeleted;
        DAW.cb.compositionAdded = UIcompositionAdded;
        DAW.cb.compositionLoading = UIcompositionLoading;
        DAW.cb.compositionSavedStatus = UIcompositionSavedStatus;
        DAW.cb.compositionSavingPromise = UIauthSaveComposition;
        DAW.cb.analyserFilled = data => UImasterAnalyser.draw(data);
        DAW.cb.pause =
            DAW.cb.stop = () => DOM.play.classList.remove("ico-pause");
        DAW.cb.play = () => DOM.play.classList.add("ico-pause");

        window.onresize();

        UIauthGetMe();
        DAW.addCompositionsFromLocalStorage();

        if (!hash.has("cmp")) {
            UIcompositionClickNewLocal();
        } else {
            DAW.addCompositionByURL(hash.get("cmp"))
                .catch(e => {
                    console.error(e);
                    return DAW.addNewComposition();
                })
                .then(cmp => DAW.openComposition(cmp.id));
            location.hash = "";
        }

    }
}