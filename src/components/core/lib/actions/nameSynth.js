"use strict";

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.nameSynth = function(id, name ) {
	const syn = this.get.synth( id );

	syn
		? this._nameSynth( id, syn, name )
		: this._error( "nameSynth", "synths", id );
};

DAWCoreBuilder.prototype._nameSynth = function( id, syn, newName ) {
	const name = DAWCoreBuilder.trim2( newName );

	if ( name && name !== syn.name ) {
		this.compositionChange( { synths: { [ id ]: { name } } } );
	}
};
