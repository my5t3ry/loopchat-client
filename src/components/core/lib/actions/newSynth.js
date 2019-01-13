"use strict";

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.newSynth = function() {
	this.compositionChange( this._newSynth() );
};

DAWCoreBuilder.prototype._newSynth = function() {
	const id = this._getNextIdOf( this.get.synths() ),
		name = this._createUniqueName( "synths", "synth" ),
		obj = {
			synths: { [ id ]: DAWCoreBuilder.json.synth( name ) },
			synthOpened: id,
		};

	if ( this.get.patternOpened() != null ) {
		obj.patternOpened = null;
	}
	return obj;
};
