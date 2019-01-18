"use strict";

export function UIopenPopupShow() {
	DOM.inputOpenFile.value =
	DOM.inputOpenURL.value = "";
	gsuiPopup.custom( {
		title: "Open",
		submit: UIopenPopupSubmit,
		element: DOM.openPopupContent,
	} );
	return false;
}

export function UIopenPopupSubmit( res ) {
	const url = DOM.inputOpenURL.value,
		file = DOM.inputOpenFile.files[ 0 ],
		prom = !url && !file ? null : url
			? DAW.addCompositionByURL( url )
			: DAW.addCompositionByBlob( file );

	return prom && prom.then( cmp => DAW.openComposition( cmp.id ) );
}
