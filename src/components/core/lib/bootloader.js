import DAWCore, {Composition, LocalStorage, Pianoroll} from '../core.js'                      ;
import {
    UIkeyboardUiControler,
    UICompositionChangedControler,
    UIcompositionsInitControlller,
    UIcontrolsCurrentTimeController,
    UIdropController,
    UIauthInitController     ,
    UIdomInitController
} from './ui.js'

class bootloader {
     bootstrap() {
         const DOM = UIdomInitController.UIdomInit();
         window.DOM = DOM;
         DAWCore.Compositon = new Composition();
         DAWCore.History = new History();
         DAWCore.Pianoroll = new Pianoroll();
         DAWCore.LocalStorage = new LocalStorage();
         DAWCore.json = {};
         DAWCore.prototype = {};
        const DAW = new DAWCore(),
            hash = new Map(location.hash
                .substr(1)
                .split("&")
                .map(kv => kv.split("="))
            );
        gswaPeriodicWaves.forEach((w, name) => (
            thisgsuiPeriodicWave.addWave(name, w.real, w.imag)
        ));

        window.DAW = DAW;
        window.VERSION = "0.19.0";

        DAW.initPianoroll();

        window.onkeyup = UIkeyboardUiControler.UIkeyboardUp;
        window.onkeydown = UIkeyboardUiControler.UIkeyboardDown;
        window.onbeforeunload = UICompositionChangedControler.UIcompositionBeforeUnload;
        document.body.ondrop = UIdropController.UIdrop;
        document.body.ondragover = () => false;
        DAW.cb.focusOn = UIcontrolsCurrentTimeController.UIcontrolsFocusOn;
        DAW.cb.currentTime = UIcontrolsCurrentTimeController.UIcontrolsCurrentTime;
        DAW.cb.clockUpdate = UIcontrolsCurrentTimeController.UIcontrolsClockUpdate;
        DAW.cb.compositionOpened = UICompositionChangedControler.UIcompositionOpened;
        DAW.cb.compositionClosed = UICompositionChangedControler.UIcompositionClosed;
        DAW.cb.compositionChanged = UICompositionChangedControler.UIcompositionChanged;
        DAW.cb.compositionDeleted = UICompositionChangedControler.UIcompositionDeleted;
        DAW.cb.compositionAdded = UICompositionChangedControler.UIcompositionAdded;
        DAW.cb.compositionLoading = UIcompositionsInitControlller.UIcompositionLoading;
        DAW.cb.compositionSavedStatus = UICompositionChangedControler.UIcompositionSavedStatus;
        DAW.cb.compositionSavingPromise = UIcompositionsInitControlller.UIauthSaveComposition;
        DAW.cb.analyserFilled = data => UIauthInitController.UImasterAnalyserInit.draw(data);
        DAW.cb.pause =
            DAW.cb.stop = () => DOM.play.classList.remove("ico-pause");
        DAW.cb.play = () => DOM.play.classList.add("ico-pause");

        window.onresize();

        UIauthInitController.UIauthGetMe();
        DAW.addCompositionsFromLocalStorage();

        if (!hash.has("cmp")) {
            UIauthInitController.UIcompositionClickNewLocal();
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