"use strict";

export class UItitleControler {
    UItitle() {
        const name = DAW.get.name() || "GridSound";

        document.title = DAW.compositionNeedSave()
            ? "*" + name
            : name;
    }

}