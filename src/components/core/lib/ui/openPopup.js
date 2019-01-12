"use strict";
                        export class  UIopenPopupConroller {
							
  UIopenPopupShow() {
	DOM.inputOpenFile.value =
	DOM.inputOpenURL.value = "";
	gsuiPopup.custom( {
		title: "Open",
		submit: this.UIopenPopupSubmit,
		element: DOM.openPopupContent,
	} );
	return false;
}

  UIopenPopupSubmit() {
	const url = DOM.inputOpenURL.value,
		file = DOM.inputOpenFile.files[ 0 ],
		prom = !url && !file ? null : url
			? DAW.addCompositionByURL( url )
			: DAW.addCompositionByBlob( file );

	prom && prom.then( cmp => DAW.openComposition( cmp.id ) );
}

						}
