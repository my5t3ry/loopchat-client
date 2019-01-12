import {UIdomInitController} from './ui/dom' ;

export class Bootloader {

    constructor() {
    }

    async bootstrap() {
        this.checkDom().then(function () {
            this.boot();
        }.bind(this))
    }

    async boot() {
        const DOM = new UIdomInitController().UIdomInit();
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
        window.DAW = DAW;
        window.VERSION = "0.19.0";
        DAW.initPianoroll();
        await require('../../gs-lib/gs-lib');
        await require('./actions.js');
        await require('./ui.js');
        await require('./utils.js');
        this.initBindings(DAW, DOM, hash);
        this.initUi();
    }

    initBindings(DAW, DOM, hash) {
        gswaPeriodicWaves.forEach((w, name) => (                                                               
            thisgsuiPeriodicWave.addWave(name, w.real, w.imag)
        ));
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

    initUi() {
        UIdomInit();
        UIauthInit();
        UIcookieInit();
        UIhistoryInit();
        UIpatternsInit();
        UIcontrolsInit();
        UIpianorollInit();
        UIpatternrollInit();
        UIrenderPopupInit();
        UIcompositionsInit();
        UIsettingsPopupInit();
        UImasterAnalyserInit();
        UIshortcutsPopupInit();
    }


    checkDom() {
        return new Promise(function (resolve, reject) {
            function step() {
                if (document.querySelector("#gsuiPatternroll-template") != null &&
                    document.querySelector("#gsuiTimeline-template") != null &&
                    document.querySelector("#gsuiSliderGroup-slider-template") != null
                ) {
                    resolve();
                } else {
                    window.requestAnimationFrame(step);
                }
            }

            window.requestAnimationFrame(step);
        });
    }

}