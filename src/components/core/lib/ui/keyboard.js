"use strict";

const UIkeyPressed = new Map();

export class  UIkeyboardUiControler {

      UIkeyboardUp(e) {
        if (!UIkeyPressed[e.key]) {
            this.UIpianorollKeyboardEvent(false, e);
        }
        delete UIkeyPressed[e.key];
    }

      UIkeyboardDown(e) {
        const key = e.key;
        let prevent;

        if (key === " ") {
            prevent = true;
            DAW.isPlaying()
                ? DOM.stop.onclick()
                : DOM.play.onclick();
        } else if (e.ctrlKey || e.altKey) {
            prevent = true;
            if (key === "o") {
                UIopenPopupShow();
            } else if (key === "s") {
                this.UIcompositionClickSave();
            } else if (key === "z") {
                DOM.undo.onclick();
            } else if (key === "Z") {
                DOM.redo.onclick();
            } else if (key === "n" && e.altKey) {
                UIcompositionClickNew();
            } else {
                prevent = false;
            }
            UIkeyPressed[key] = true;
        } else {
            this.UIpianorollKeyboardEvent(true, e);
        }
        if (prevent) {
            e.preventDefault();
        }
    }

}

}
