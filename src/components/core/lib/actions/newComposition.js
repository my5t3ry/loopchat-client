"use strict";

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.newComposition = function() {
	return this.addComposition( DAWCoreBuilder.json.composition( this.env, DAWCoreBuilder.uuid() ) )
		.then( cmp => this.composition.load( cmp ) )
		.then( cmp => this._compositionOpened( cmp ) );
};
