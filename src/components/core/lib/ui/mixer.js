"use strict";
import gsuiMixer from "../../../gs-lib/js/gsuiMixer";

export function UImixerInit() {

	const UImixer = new gsuiMixer();
	DOM[ "pan-mixer" ].append( UImixer.rootElement );
	UImixer.attached();
}
