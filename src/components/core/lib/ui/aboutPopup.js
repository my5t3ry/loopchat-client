"use strict";

export class UIaboutPopupInitController {

    constructor() {
    }

    UIaboutPopupInit() {
        DOM.about.onclick = UIaboutPopupInitController.UIaboutPopupShow;
        DOM.versionCheck.onclick = UIaboutPopupInitController.UIaboutPopupVersionCheck;
    }

    UIaboutPopupShow() {
        gsuiPopup.custom({
            title: "About",
            element: DOM.aboutPopupContent,
        });
        return false;
    }

    UIaboutPopupVersionCheck() {
        const cl = DOM.version.classList;


        cl.remove("ok", "ko");
        cl.add("searching");
        fetch("https://gridsound.github.io/daw/VERSION?" + Math.random())
            .then(res => res.text())
            .then(res => {
                cl.remove("searching");
                cl.add(res === VERSION ? "ok" : "ko");
            }, () => cl.remove("searching"));
        return false;
    }


}