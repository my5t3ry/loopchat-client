"use strict";
const UICompositions = new Map();

export class  UIcompositionsInitControlller {


      UIcompositionsInit() {
        DOM.newCloudComposition.onclick = this.UIcompositionClickNewCloud;
        DOM.newLocalComposition.onclick = this.UIcompositionClickNewLocal;
        DOM.openLocalComposition.onclick = IopenPopupShow;
        DOM.cloudCmps.onclick =
            DOM.localCmps.onclick = e => {
                const cmp = e.target.closest(".cmp");

                if (cmp) {
                    const id = cmp.dataset.id;

                    switch (e.target.dataset.action) {
                        case "save":
                            this.UIcompositionClickSave();
                            break;
                        case "open":
                            this.UIcompositionClickOpen(id);
                            break;
                        case "json":
                            this.UIcompositionClickJSONExport(id, e);
                            break;
                        case "delete":
                            this.UIcompositionClickDelete(id);
                            break;
                    }
                }
            };

    }

      UIcompositionBeforeUnload() {
        if (DAW.compositionNeedSave()) {
            return "Data unsaved";
        }
    }


      UIcompositionOpened({id, synthOpened}) {
        const html = UIcompositions.get(id),
            par = html.root.parentNode;

        html.root.export.classList.add("cmp-loaded");
        par.prepend(html.root);
        par.scrollTop = 0;
        UIsynthsExpandSynth(synthOpened, true);
        UItitle();
    }


      UIcompositionLoading(cmp, loading) {
        UIcompositions.get(cmp.id).root.export.classList.toggle("cmp-loading", loading);
    }


      UIcompositionSavedStatus(cmp, saved) {
        UIcompositions.get(cmp.id).root.export.classList.toggle("cmp-notSaved", !saved);
        UItitle();
    }


      UIcompositionDeleted({id}) {
        const html = UIcompositions.get(id);

        if (html) {
            html.root.remove();
            UIcompositions.delete(id);
        }
    }


      UIcompositionAdded(cmp, opt) {
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


      UIcompositionClosed(cmp) {
        UIcompositions.get(cmp.id).root.export.classList.remove("cmp-loaded");
        UIpatternroll.empty();
        UIpatternroll.loop(false);
        UIpatternroll.setFontSize(32);
        UIpatternroll.setPxPerBeat(40);
        UIsynth.empty();
        UIpianoroll.empty();
        UIpianoroll.loop(false);
        DOM.pianorollName.textContent = "";
        DOM.pianorollBlock.export.classList.remove("show");
        UIsynths.forEach(syn => syn.remove());
        UIsynths.clear();
        UIpatterns.clear();
    }


      UIcompositionClickNewLocal() {
        (!DAW.compositionNeedSave()
                ? DAW.addNewComposition()
                : gsuiPopup.confirm("Warning", "Are you sure you want to discard unsaved works")
                    .then(b => b && DAW.addNewComposition())
        ).then(cmp => cmp && DAW.openComposition(cmp.id));
        return false;
    }


      UIcompositionClickNewCloud() {
        if (!gsapiClient.user.id) {
            gsuiPopup.alert("Error",
                "You can not create a new composition in the <b>cloud</b><br/>without being connected");
        } else {
            // ...
        }
        return false;
    }


      UIcompositionClickDelete(id) {
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


      UIcompositionClickJSONExport(id, e) {
        const json = DAW.exportCompositionToJSON(id);

        e.target.href = json.url;
        e.target.download = json.name;
    }


      UIcompositionClickOpen(id) {
        if (DAW.compositionNeedSave()) {
            gsuiPopup.confirm("Warning",
                "Are you sure you want to discard unsaved works"
            ).then(ok => ok && DAW.openComposition(id));
        } else {
            DAW.openComposition(id);
        }
        return false;
    }


      UIcompositionClickSave() {
        if (document.cookie.indexOf("cookieAccepted") > -1) {
            DAW.saveComposition();
        } else {
            gsuiPopup.alert("Error",
                "You have to accept our cookies before saving locally your composition.");
        }
    }
}
