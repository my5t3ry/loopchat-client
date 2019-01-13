"use strict";

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.exportCompositionToJSON = function(id ) {
	const cmp = this.get.composition( id );

	if ( cmp ) {
		return {
			name: ( cmp.name || "untitled" ) + ".gs",
			url: this._exportCompositionToJSON(
				DAWCoreBuilder.Composition.epure(
				DAWCoreBuilder.objectDeepCopy( cmp ) ) )
		};
	}
};

DAWCoreBuilder ._exportJSONTabs = {
	keys: 4,
	synths: 5,
	tracks: 3,
	blocks: 3,
	patterns: 3,
};

DAWCoreBuilder.prototype._exportCompositionToJSON = function( cmp ) {
	const delTabs = DAWCoreBuilder._exportJSONTabs,
		reg = /^\t"(\w*)": {$/,
		lines = JSON.stringify( cmp, null, "\t" ).split( "\n" );
	let regTab,
		regTa2,
		delTabCurr;

	if ( DAWCoreBuilder._URLToRevoke ) {
		URL.revokeObjectURL( DAWCoreBuilder._URLToRevoke );
	}
	lines.forEach( ( line, i ) => {
		const res = reg.exec( line );

		if ( res ) {
			if ( delTabCurr = delTabs[ res[ 1 ] ] ) {
				regTab = new RegExp( `^\\t{${ delTabCurr }}` );
				regTa2 = new RegExp( `^\\t{${ delTabCurr - 1 }}\\}` );
			}
		}
		if ( delTabCurr ) {
			lines[ i ] = lines[ i ].replace( regTab, "~" ).replace( regTa2, "~}" );
		}
	} );
	return DAWCoreBuilder._URLToRevoke = URL.createObjectURL( new Blob( [
		lines.join( "\n" ).replace( /\n~/g, " " ) ] ) );
};
