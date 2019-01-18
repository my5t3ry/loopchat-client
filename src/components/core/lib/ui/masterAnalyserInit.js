"use strict";

import {gsuiSpectrum} from "../../../gs-lib/js/gsuiSpectrum";

export function UImasterAnalyserInit() {
	const spc = new gsuiSpectrum();

	spc.setResolution( 512 );
	DOM.analyser.append( spc.rootElement );
	window.UImasterAnalyser = spc;
}
