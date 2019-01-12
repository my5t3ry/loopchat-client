"use strict";
import {DAWCore} from '../../core'


DAWCore.prototype.abortWAVExport = function() {
	if ( this.ctx instanceof OfflineAudioContext ) {
		this.composition.stop();
	}
};
                                                                                                   