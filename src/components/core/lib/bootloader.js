import {UIdomInit} from './ui/dom' ;
import DAWCoreBuilder from "./DAWCoreBuilder";
import {gswaPeriodicWaves} from "../../core/gs-wa/gswaPeriodicWaves/gswaPeriodicWaves"
import {UIkeyboardDown, UIkeyboardUp} from "./ui/keyboard";
import {UIdrop} from "./ui/drop";
import {UIcontrolsClockUpdate, UIcontrolsCurrentTime, UIcontrolsFocusOn, UIcontrolsInit} from "./ui/controls";
import {UIcompositionChanged} from "./ui/compositionChanged";
import {UIcompositionAdded, UIcompositionBeforeUnload, UIcompositionClickNewLocal, UIcompositionClosed, UIcompositionDeleted, UIcompositionLoading, UIcompositionOpened, UIcompositionSavedStatus, UIcompositionsInit} from "./ui/compositions";
import {UIauthGetMe, UIauthInit, UIauthSaveComposition} from "./ui/auth";
import {UIcookieInit} from "./ui/cookie";
import {UIhistoryInit} from "./ui/history";
import {UIpatternsInit} from "./ui/patterns";
import {UIpianorollInit} from "./ui/pianoroll";
import {UIpatternrollInit} from "./ui/patternroll";
import {UIrenderPopupInit} from "./ui/renderPopup";
import {UIsettingsPopupInit} from "./ui/settingsPopup";
import {UImasterAnalyserInit} from "./ui/masterAnalyserInit";
import {UIshortcutsPopupInit} from "./ui/shortcutsPopup";
import gsuiPatternroll from "../../gs-lib/js/gsuiPatternroll";
import gsuiPianoroll from "../../gs-lib/js/gsuiPianoroll";
import gsuiSynthesizer from "../../gs-lib/js/gsuiSynthesizer";

export class Bootloader {

    constructor() {
    }

    async bootstrap() {
        await require('./ui.js');
        this.checkDom().then(function () {
            this.boot();
        }.bind(this))
    }

    async boot() {
         UIdomInit();
        const DAW = new DAWCoreBuilder(),
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
        await require('./utils.js');
        this.initBindings(DAW, DOM, hash);
        this.initUi();
    }

    initBindings(DAW, DOM, hash) {
        // gswaPeriodicWaves.forEach((w, name) => (
        //     thisgsuiPeriodicWave.addWave(name, w.real, w.imag)
        // ));
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