"use strict";

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.openComposition = function(id ) {
	const cmp = this.compositions.get( id );

	if ( cmp ) {
		if ( this.composition.loaded ) {
			this.closeComposition();
		}
		return this.composition.load( cmp )
			.then( cmp => this._compositionOpened( cmp ) );
	}
	return Promise.reject( `DAWCore: no composition with the id "${ id }".` );
};

DAWCoreBuilder.prototype._compositionOpened = function( cmp ) {
	this._call( "focusOn", "composition", true );
	this._call( "compositionOpened", cmp );
	this._startLoop();
	return cmp;
};
