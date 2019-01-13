"use strict";
import DAWCoreBuilder from "../DAWCoreBuilder";

DAWCoreBuilder.trim2 = str => str ? str.trim().replace( /\s+/g, " " ) : "";
