"use strict";

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.removePattern = function(id ) {
	const pat = this.get.pattern( id );

	pat
		? this.compositionChange( this._removePattern( id, pat ) )
		: this._error( "removePattern", "patterns", id );
};

DAWCoreBuilder.prototype._removePattern = function( patId, pat ) {
	const obj = {
			keys: { [ pat.keys ]: undefined },
			patterns: { [ patId ]: undefined },
		},
		blocks = Object.entries( this.get.blocks() ).reduce( ( blocks, [ blcId, blc ] ) => {
			if ( blc.pattern === patId ) {
				blocks[ blcId ] = undefined;
			}
			return blocks;
		}, {} );

	if ( !DAWCoreBuilder.objectIsEmpty( blocks ) ) {
		obj.blocks = blocks;
	}
	if ( patId === this.get.patternOpened() ) {
		if ( !Object.entries( this.get.patterns() ).some( ( [ k, v ] ) => {
			if ( k !== patId && v.synth === pat.synth ) {
				obj.patternOpened = k;
				return true;
			}
		} ) ) {
			obj.patternOpened = null;
		}
	}
	return obj;
};
