"use strict";

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.openSynth = function(id ) {
	if ( id !== this.get.synthOpened() ) {
		const patId = this._openSynth_find( id ),
			obj = { synthOpened: id };

		if ( patId !== this.get.patternOpened() ) {
			obj.patternOpened = patId;
		}
		this.composition.change( obj, DAWCore.composeUndo( this.get.composition(), obj ) );
	}
};

DAWCoreBuilder.prototype._openSynth_find = function( id ) {
	const pat = Object.entries( this.get.patterns() )
			.find( ( [ patId, pat ] ) => pat.synth === id );

	return pat ? pat[ 0 ] : null;
};
