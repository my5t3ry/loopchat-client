"use strict";
import gsuiMixer from "../../../gs-lib/js/gsuiMixer";

const UImixer = new gsuiMixer();

export function UImixerInit() {
	DOM[ "pan-mixer" ].append( UImixer.rootElement );
	UImixer.attached();
}
