import DAWCore, {Composition, LocalStorage, Pianoroll} from '../core.js'
import {
    UIkeyboardUiControler,
    UICompositionChangedControler,
    UIcompositionsInitControlller,
    UIcontrolsCurrentTimeController,
    UIdropController,
    UIauthInitController,
    UIdomInitController
} from './ui.js'

export class Bootloader {

    constructor() {


    }

    async bootstrap() {
        const DOM = new UIdomInitController().UIdomInit;
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

        window.onkeyup = new UIkeyboardUiControler.UIkeyboardUp;
        window.onkeydown = new UIkeyboardUiControler.UIkeyboardDown;
        window.onbeforeunload = new UICompositionChangedControler.UIcompositionBeforeUnload;
        document.body.ondrop = new UIdropController.UIdrop;
        document.body.ondragover = () => false;
        DAW.cb.focusOn = new UIcontrolsCurrentTimeController.UIcontrolsFocusOn;
        DAW.cb.currentTime = new UIcontrolsCurrentTimeController.UIcontrolsCurrentTime;
        DAW.cb.clockUpdate = new UIcontrolsCurrentTimeController.UIcontrolsClockUpdate;
        DAW.cb.compositionOpened = new UICompositionChangedControler.UIcompositionOpened;
        DAW.cb.compositionClosed = new UICompositionChangedControler.UIcompositionClosed;
        DAW.cb.compositionChanged = new UICompositionChangedControler.UIcompositionChanged;
        DAW.cb.compositionDeleted = new UICompositionChangedControler.UIcompositionDeleted;
        DAW.cb.compositionAdded = new UICompositionChangedControler.UIcompositionAdded;
        DAW.cb.compositionLoading = new UIcompositionsInitControlller.UIcompositionLoading;
        DAW.cb.compositionSavedStatus = new UICompositionChangedControler.UIcompositionSavedStatus;
        DAW.cb.compositionSavingPromise = new UIcompositionsInitControlller.UIauthSaveComposition;
        DAW.cb.analyserFilled = data => new UIauthInitController.UImasterAnalyserInit.draw(data);
        DAW.cb.pause =
            DAW.cb.stop = () => DOM.play.classList.remove("ico-pause");
        DAW.cb.play = () => DOM.play.classList.add("ico-pause");

        window.onresize();

        UIauthInitController.UIauthGetMe();
        DAW.addCompositionsFromLocalStorage();

        if (!hash.has("cmp")) {
            new UIauthInitController.UIcompositionClickNewLocal();
        } else {
            DAW.addCompositionByURL(hash.get("cmp"))
                .catch(e => {
                    console.error(e);
                    return DAW.addNewComposition();
                })
                .then(cmp => DAW.openComposition(cmp.id));
            location.hash = "";
        }
        await require('./actions.js');
        await require('./utils.js');
    }
}