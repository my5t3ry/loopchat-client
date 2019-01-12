"use strict";

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.liveChangeSynth = function(id, obj ) {
	const syn = this.composition._synths.get( id );

	!syn
		? this._error( "liveChangeSynth", "synths", id )
		: DAWCoreBuilder.objectDeepAssign( syn.data, obj );
};
