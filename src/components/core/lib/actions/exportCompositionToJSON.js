"use strict";

DAWCore.prototype.exportCompositionToJSON = function( id ) {
	const cmp = this.get.composition( id );

	if ( cmp ) {
		return {
			name: ( cmp.name || "untitled" ) + ".gs",
			url: this._exportCompositionToJSON(
				DAWCore.Composition.epure(
				DAWCore.objectDeepCopy( cmp ) ) )
		};
	}
};

DAWCore._exportJSONTabs = {
	keys: 4,
	synths: 5,
	tracks: 3,
	blocks: 3,
	patterns: 3,
};

DAWCore.prototype._exportCompositionToJSON = function( cmp ) {
	const delTabs = DAWCore._exportJSONTabs,
		reg = /^\t"(\w*)": {$/,
		lines = JSON.stringify( cmp, null, "\t" ).split( "\n" );
	let regTab,
		regTa2,
		delTabCurr;

	if ( DAWCore._URLToRevoke ) {
		URL.revokeObjectURL( DAWCore._URLToRevoke );
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
	return DAWCore._URLToRevoke = URL.createObjectURL( new Blob( [
		lines.join( "\n" ).replace( /\n~/g, " " ) ] ) );
};
