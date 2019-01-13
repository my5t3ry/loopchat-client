"use strict";

import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.prototype.addCompositionsFromLocalStorage = function() {
	return Promise.all( DAWCoreBuilder.LocalStorage
		.getAll().map( cmp => this.addComposition( cmp ) ) );
};
