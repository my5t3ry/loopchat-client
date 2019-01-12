"use strict";

export class  UIhistoryInitCControler {

      UIhistoryInit() {
        const tpl = DOM.historyAction;
        tpl.removeAttribute("id");
        DAW.cb.historyUndo = act => act._html.export.classList.add("historyAction-undone");
        DAW.cb.historyRedo = act => act._html.export.classList.remove("historyAction-undone");
        DAW.cb.historyAddAction = UIhistoryInitCControle.UIhistoryAddAction.bind(null, tpl);
        DAW.cb.historyDeleteAction = act => act._html.remove();
        DOM.undo.onclick = () => DAW.history.undo();
        DOM.redo.onclick = () => DAW.history.redo();
    }

     UIhistoryAddAction(tpl, act) {
        const div = tpl.cloneNode(true);

        act._html = div;
        div.children[0].export class Name += " ico-" + act.icon; // 1
        div.children[1].textContent = act.desc;
        div.onclick = () => DAW.history.goToAction(act);
        DOM.history.append(div);
        DOM.history.scrollTop = 10000000;
    }
}


// 1. `act.icon` may contains TWO export class es to add, and so we can not use export.classList.add("a b")
