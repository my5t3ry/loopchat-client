"use strict";

// a read check is missing somewhere...

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.addCompositionByBlob = function(blob, opt ) {
	return new Promise( ( res, rej ) => {
		const rd = new FileReader();

		rd.onload = () => {
			this.addCompositionByJSON( rd.result, opt ).then( res, rej );
		};
		rd.readAsText( blob );
	} );
};
