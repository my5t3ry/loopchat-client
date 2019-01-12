"use strict";
const UICompositions = new Map();

class UIcompositionsInitControlller {


    static UIcompositionsInit() {
        DOM.newCloudComposition.onclick = UICompositionsBuilder.UIcompositionClickNewCloud;
        DOM.newLocalComposition.onclick = UICompositionsBuilder.UIcompositionClickNewLocal;
        DOM.openLocalComposition.onclick = UIopenPopupShow;
        DOM.cloudCmps.onclick =
            DOM.localCmps.onclick = e => {
                const cmp = e.target.closest(".cmp");

                if (cmp) {
                    const id = cmp.dataset.id;

                    switch (e.target.dataset.action) {
                        case "save":
                            UICompositionsBuilder.UIcompositionClickSave();
                            break;
                        case "open":
                            UICompositionsBuilder.UIcompositionClickOpen(id);
                            break;
                        case "json":
                            UICompositionsBuilder.UIcompositionClickJSONExport(id, e);
                            break;
                        case "delete":
                            UICompositionsBuilder.UIcompositionClickDelete(id);
                            break;
                    }
                }
            };

    }

    static UIcompositionBeforeUnload() {
        if (DAW.compositionNeedSave()) {
            return "Data unsaved";
        }
    }


    static UIcompositionOpened({id, synthOpened}) {
        const html = UIcompositions.get(id),
            par = html.root.parentNode;

        html.root.classList.add("cmp-loaded");
        par.prepend(html.root);
        par.scrollTop = 0;
        UIsynthsExpandSynth(synthOpened, true);
        UItitle();
    }


    static UIcompositionLoading(cmp, loading) {
        UIcompositions.get(cmp.id).root.classList.toggle("cmp-loading", loading);
    }


    static UIcompositionSavedStatus(cmp, saved) {
        UIcompositions.get(cmp.id).root.classList.toggle("cmp-notSaved", !saved);
        UItitle();
    }


    static UIcompositionDeleted({id}) {
        const html = UIcompositions.get(id);

        if (html) {
            html.root.remove();
            UIcompositions.delete(id);
        }
    }


    static UIcompositionAdded(cmp, opt) {
        const root = DOM.cmp.cloneNode(true),
            html = {
                root,
                bpm: root.querySelector(".cmp-bpm"),
                name: root.querySelector(".cmp-name"),
                duration: root.querySelector(".cmp-duration"),
            };

        root.dataset.id = cmp.id;
        html.bpm.textContent = cmp.bpm;
        html.name.textContent = cmp.name;
        html.duration.textContent = DAWCore.time.beatToMinSec(cmp.duration, cmp.bpm);
        UIcompositions.set(cmp.id, html);
        (opt.localSaving
            ? DOM.localCmps
            : DOM.cloudCmps).append(root);
    }


    static UIcompositionClosed(cmp) {
        UIcompositions.get(cmp.id).root.classList.remove("cmp-loaded");
        UIpatternroll.empty();
        UIpatternroll.loop(false);
        UIpatternroll.setFontSize(32);
        UIpatternroll.setPxPerBeat(40);
        UIsynth.empty();
        UIpianoroll.empty();
        UIpianoroll.loop(false);
        DOM.pianorollName.textContent = "";
        DOM.pianorollBlock.classList.remove("show");
        UIsynths.forEach(syn => syn.remove());
        UIsynths.clear();
        UIpatterns.clear();
    }


    static UIcompositionClickNewLocal() {
        (!DAW.compositionNeedSave()
                ? DAW.addNewComposition()
                : gsuiPopup.confirm("Warning", "Are you sure you want to discard unsaved works")
                    .then(b => b && DAW.addNewComposition())
        ).then(cmp => cmp && DAW.openComposition(cmp.id));
        return false;
    }


    static UIcompositionClickNewCloud() {
        if (!gsapiClient.user.id) {
            gsuiPopup.alert("Error",
                "You can not create a new composition in the <b>cloud</b><br/>without being connected");
        } else {
            // ...
        }
        return false;
    }


    static UIcompositionClickDelete(id) {
        const cmp = DAW.get.composition(id);

        gsuiPopup.confirm("Warning",
            `Are you sure you want to delete "${cmp.name}" ? (no undo possible)`,
            "Delete"
        ).then(b => {
            if (b) {
                if (id === DAW.get.id()) {
                    const next = Array.from(UIcompositions.keys())[1];

                    if (next) {
                        DAW.openComposition(next);
                    }
                }
                DAW.deleteComposition(id);
            }
        });
    }


    static UIcompositionClickJSONExport(id, e) {
        const json = DAW.exportCompositionToJSON(id);

        e.target.href = json.url;
        e.target.download = json.name;
    }


    static UIcompositionClickOpen(id) {
        if (DAW.compositionNeedSave()) {
            gsuiPopup.confirm("Warning",
                "Are you sure you want to discard unsaved works"
            ).then(ok => ok && DAW.openComposition(id));
        } else {
            DAW.openComposition(id);
        }
        return false;
    }


    static UIcompositionClickSave() {
        if (document.cookie.indexOf("cookieAccepted") > -1) {
            DAW.saveComposition();
        } else {
            gsuiPopup.alert("Error",
                "You have to accept our cookies before saving locally your composition.");
        }
    }
}
