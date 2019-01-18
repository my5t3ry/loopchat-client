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
import gsuiTracklist from "../../gs-lib/js/gsuiTracklist";
import gsuiTrack from "../../gs-lib/js/gsuiTrack";
import gsuiSliderGroup from "../../gs-lib/js/gsuiSliderGroup";
import  gsuiTimeline from "../../gs-lib/js/gsuiTimeline";
import gsuiOscillator from "../../gs-lib/js/gsuiOscillator";
import gsuiMixer from "../../gs-lib/js/gsuiMixer";
import gsuiDragline from "../../gs-lib/js/gsuiDragline";
import gsuiDotline from "../../gs-lib/js/gsuiDotline";
import gsuiBlocksManager from "../../gs-lib/js/gsuiBlocksManager";
import gsuiSlider from "../../gs-lib/js/gsuiSlider";

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
        this.initTemplates();
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

        const UIsynth = new gsuiSynthesizer();
        window.synth = UIsynth;
        window.compositions = Object.seal({
            cloud: new Map(),
            local: new Map(),
            get(cmp) {
                return this["local"].get(cmp.id);
            },
            set(cmp, html) {
                this["local"].set(cmp.id, html);
            },
            delete(cmp) {
                this["local"].delete(cmp.id);
            },
        });
        window.UIpatterns = Object.seal({
            local: new Map(),
            get(cmp) {
                return this["local"].get(cmp.id);
            },
            set(cmp, html) {
                this["local"].set(cmp.id, html);
            },
            delete(cmp) {
                this["local"].delete(cmp.id);
            },
        });



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

    initTemplates(){


        gsuiTrack.template = document.querySelector( "#gsuiTrack-template" );
        gsuiTrack.template.remove();
        gsuiTrack.template.removeAttribute( "id" );







        gsuiPianoroll.template = document.querySelector("#gsuiPianoroll-template");
        gsuiPianoroll.template.remove();
        gsuiPianoroll.template.removeAttribute("id");
        gsuiPianoroll.blockTemplate = document.querySelector("#gsuiPianoroll-block-template");
        gsuiPianoroll.blockTemplate.remove();
        gsuiPianoroll.blockTemplate.removeAttribute("id");

        gsuiPatternroll.template = document.querySelector("#gsuiPatternroll-template");
        gsuiPatternroll.template.remove();
        gsuiPatternroll.template.removeAttribute("id");
        gsuiPatternroll.blockTemplate = document.querySelector("#gsuiPatternroll-block-template");
        gsuiPatternroll.blockTemplate.remove();
        gsuiPatternroll.blockTemplate.removeAttribute("id");


        gsuiOscillator.template = document.querySelector( "#gsuiOscillator-template" );
        gsuiOscillator.template.remove();
        gsuiOscillator.template.removeAttribute( "id" );


        gsuiMixer.template = document.querySelector( "#gsuiMixer-template" );
        gsuiMixer.template.remove();
        gsuiMixer.template.removeAttribute( "id" );

        gsuiMixer.channelTemplate = document.querySelector( "#gsuiMixerChannel-template" );
        gsuiMixer.channelTemplate.remove();
        gsuiMixer.channelTemplate.removeAttribute( "id" );
        gsuiDragline.template = document.querySelector( "#gsuiDragline-template" );
        gsuiDragline.template.remove();
        gsuiDragline.template.removeAttribute( "id" );


        gsuiTimeline.template = document.querySelector( "#gsuiTimeline-template" );
        gsuiTimeline.template.remove();
        gsuiTimeline.template.removeAttribute( "id" );

        document.addEventListener( "mousemove", e => {
            gsuiTimeline._focused && gsuiTimeline._focused._mousemove( e );
        } );
        document.addEventListener( "mouseup", e => {
            gsuiTimeline._focused && gsuiTimeline._focused._mouseup( e );
        } );


        gsuiTracklist.template = document.querySelector( "#gsuiTracklist-template" );
        gsuiTracklist.template.remove();
        gsuiTracklist.template.removeAttribute( "id" );
        


        document.addEventListener( "mousemove", e => {
            gsuiDragline._focused && gsuiDragline._focused._mousemove( e );
        } );
        document.addEventListener( "mouseup", e => {
            gsuiDragline._focused && gsuiDragline._focused._mouseup( e );
        } );
        document.addEventListener( "keydown", e => {
            gsuiDragline._focused && gsuiDragline._focused._keydown( e );
        } );


        document.addEventListener( "mousemove", e => {
            gsuiDotline.focused && gsuiDotline.focused._mousemoveDot( e );
        } );
        document.addEventListener( "mouseup", () => {
            gsuiDotline.focused && gsuiDotline.focused._mouseupDot();
        } );

        document.addEventListener( "mousemove", e => {
            gsuiBlocksManager._focused && gsuiBlocksManager._focused._mousemove( e );
        } );
        document.addEventListener( "mouseup", e => {
            gsuiBlocksManager._focused && gsuiBlocksManager._focused._mouseup( e );
        } );
        document.addEventListener( "keyup", e => {
            gsuiBlocksManager._focused && gsuiBlocksManager._focused._keyup( e );
        } );

        gsuiSynthesizer.template = document.querySelector( "#gsuiSynthesizer-template" );
        gsuiSynthesizer.template.remove();
        gsuiSynthesizer.template.removeAttribute("id");

        gsuiSliderGroup.template = document.querySelector( "#gsuiSliderGroup-template" );
        gsuiSliderGroup.template.remove();
        gsuiSliderGroup.template.removeAttribute( "id" );
        gsuiSliderGroup.sliderTemplate = document.querySelector( "#gsuiSliderGroup-slider-template" );
        gsuiSliderGroup.sliderTemplate.remove();
        gsuiSliderGroup.sliderTemplate.removeAttribute( "id" );


        gsuiSlider.template = document.querySelector( "#gsuiSlider-template" );
        gsuiSlider.template.remove();
        gsuiSlider.template.removeAttribute( "id" );


        document.addEventListener( "pointerlockchange", () => {
            const el = document.pointerLockElement,
                slider = el && el._gsuiSlider_instance;

            if ( slider ) {
                slider._locked = true;
            }
        } );


        document.addEventListener( "mouseup", e => {
            gsuiSliderGroup._focused && gsuiSliderGroup._focused._mouseup( e );
        } );

}
    checkDom() {
        return new Promise(function (resolve, reject) {
            function step() {
                if (document.querySelector("#gsuiPatternroll-template") != null &&
                    document.querySelector("#gsuiTracklist-template") != null &&
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