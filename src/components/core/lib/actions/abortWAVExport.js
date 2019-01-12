"use strict";


import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.abortWAVExport = function() {
	if ( this.ctx instanceof OfflineAudioContext ) {
		this.composition.stop();
	}
};
                                                                                                   