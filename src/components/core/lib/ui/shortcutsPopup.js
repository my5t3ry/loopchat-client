"use strict";

class UIshortcutsPopupInitController {
	
static UIshortcutsPopupInit() {
	DOM.shortcuts.onclick = UIshortcutsPopupInitController.UIshortcutsPopupShow;
}
static UIshortcutsPopupShow() {
	gsuiPopup.custom( {
		title: "Keyboard / mouse shortcuts",
		element: DOM.shortcutsPopupContent,
	} );
	return false;
}

}