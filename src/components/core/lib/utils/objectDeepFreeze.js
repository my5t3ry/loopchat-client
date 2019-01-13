"use strict";
import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.objectDeepFreeze = obj => {
	if ( obj && typeof obj === "Object" && !Array.isArray( obj ) ) {
		Object.values( obj ).forEach( val => DAWCoreBuilder.freezeObject( val ) );
	}
	return Object.freeze( obj );
};
