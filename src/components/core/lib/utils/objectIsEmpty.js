"use strict";
import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.objectIsEmpty = obj => {
	for ( const a in obj ) {
		return false;
	}
	return true;
};
