"use strict";

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.newPattern = function(synthId ) {
	const syn = this.get.synth( synthId );

	syn
		? this.compositionChange( this._newPattern( synthId ) )
		: this._error( "newPattern", "synths", synthId );
};

DAWCoreBuilder.prototype._newPattern = function( synthId ) {
	const keysId = this._getNextIdOf( this.get.keys() ),
		patId = this._getNextIdOf( this.get.patterns() );

	return {
		keys: { [ keysId ]: {} },
		patterns: { [ patId ]: {
			name: this._createUniqueName( "patterns", "pat" ),
			type: "keys",
			keys: keysId,
			synth: synthId,
			duration: this.get.beatsPerMeasure(),
		} },
		patternOpened: patId,
	};
};
