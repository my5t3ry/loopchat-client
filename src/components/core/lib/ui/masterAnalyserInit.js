"use strict";

class UImasterAnalyserInitController {
	
static UImasterAnalyserInit() {
	const spc = new gsuiSpectrum();

	spc.setResolution( 512 );
	DOM.analyser.append( spc.rootElement );
	window.UImasterAnalyser = spc;
}

}
