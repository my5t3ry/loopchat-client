"use strict";

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.addCompositionsFromLocalStorage = function() {
	return Promise.all( DAWCore.LocalStorage
		.getAll().map( cmp => this.addComposition( cmp ) ) );
};
