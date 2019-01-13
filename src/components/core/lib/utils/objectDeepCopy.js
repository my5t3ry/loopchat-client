"use strict";
import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.objectDeepCopy = obj => JSON.parse( JSON.stringify( obj ) );
