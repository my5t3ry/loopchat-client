"use strict";

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.addNewComposition = function(opt ) {
	return this.addComposition(
		DAWCoreBuilder.json.composition( this.env, DAWCoreBuilder.uuid() ), opt );
};
