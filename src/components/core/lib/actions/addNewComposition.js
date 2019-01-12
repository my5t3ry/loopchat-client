"use strict";

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.addNewComposition = function(opt ) {
	return this.addComposition(
		DAWCore.json.composition( this.env, DAWCore.uuid() ), opt );
};
