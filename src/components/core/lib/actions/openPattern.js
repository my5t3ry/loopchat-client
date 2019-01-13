"use strict";

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.openPattern = function(id ) {
	if ( id !== this.get.patternOpened() ) {
		const synId = this.get.pattern( id ).synth,
			obj = { patternOpened: id };

		if ( synId !== this.get.synthOpened() ) {
			obj.synthOpened = synId;
		}
		this.composition.change( obj, DAWCoreBuilder.composeUndo( this.get.composition(), obj ) );
	}
};
