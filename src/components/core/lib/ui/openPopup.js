"use strict";
                        class UIopenPopupConroller {
							
static UIopenPopupShow() {
	DOM.inputOpenFile.value =
	DOM.inputOpenURL.value = "";
	gsuiPopup.custom( {
		title: "Open",
		submit: UIopenPopupConroller.UIopenPopupSubmit,
		element: DOM.openPopupContent,
	} );
	return false;
}

static UIopenPopupSubmit() {
	const url = DOM.inputOpenURL.value,
		file = DOM.inputOpenFile.files[ 0 ],
		prom = !url && !file ? null : url
			? DAW.addCompositionByURL( url )
			: DAW.addCompositionByBlob( file );

	prom && prom.then( cmp => DAW.openComposition( cmp.id ) );
}

						}
