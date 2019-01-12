"use strict";

export class  UIshortcutsPopupInitController {
	
  UIshortcutsPopupInit() {
	DOM.shortcuts.onclick = UIshortcutsPopupInitController.UIshortcutsPopupShow;
}
  UIshortcutsPopupShow() {
	gsuiPopup.custom( {
		title: "Keyboard / mouse shortcuts",
		element: DOM.shortcutsPopupContent,
	} );
	return false;
}

}