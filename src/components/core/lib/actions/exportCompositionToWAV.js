"use strict";

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.exportCompositionToWAV = function() {
	const ctx = this.ctx,
		smpRate = this.env.sampleRate,
		dur = Math.ceil( this.get.duration() * 60 / this.get.bpm() ) || 1,
		ctxOff = new OfflineAudioContext( 2, ~~( dur * smpRate ), smpRate );

	this.stop();
	if ( DAWCoreBuilder._URLToRevoke ) {
		URL.revokeObjectURL( DAWCoreBuilder._URLToRevoke );
	}
	this.setCtx( ctxOff );
	this.composition.play();
	return ctxOff.startRendering().then( buffer => {
		const pcm = gswaEncodeWAV.encode( buffer, { float32: true } ),
			url = URL.createObjectURL( new Blob( [ pcm ] ) );

		this.composition.stop();
		this.setCtx( ctx );
		DAWCoreBuilder._URLToRevoke = url;
		return {
			url,
			name: ( this.get.name() || "untitled" ) + ".wav",
		};
	} );
};
