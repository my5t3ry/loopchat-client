"use strict";

export function UIshortcutsPopupInit() {
	DOM.shortcuts.onclick = UIshortcutsPopupShow;
}

export function UIshortcutsPopupShow() {
	gsuiPopup.custom( {
		title: "Keyboard / mouse shortcuts",
		element: DOM.shortcutsPopupContent,
	} );
	return false;
}
