"use strict";

import gsuiSynthesizer from "../../../gs-lib/js/gsuiSynthesizer";

export function UIsynthOpen( id ) {

	window.synth.empty();
	if ( !id ) {
		DOM.synthName.textContent = "";
	} else {
		const syn = DAW.get.synth( id );

		DOM.synthName.textContent = syn.name;
		UIsynthChange( syn );
	}
}

export function UIsynthChange( obj ) {
	if ( "name" in obj ) {
		DOM.synthName.textContent = obj.name;
	}
	window.synth.change( obj );
}

export function UIsynthInit() {

	window.synth.oninput = ( id, attr, val ) => {
		DAW.liveChangeSynth( DAW.get.synthOpened(), {
			oscillators: { [ id ]: { [ attr ]: val } }
		} );
	};
	window.synth.onchange = obj => {
		DAW.compositionChange( { synths: {
			[ DAW.get.synthOpened() ]: obj
		} } );
	};
	window.synth.setWaveList( Array.from( gswaPeriodicWaves.keys() ) );
	DOM.synthName.onclick = () => {
		const id = DAW.get.synthOpened(),
			name = DOM.synthName.textContent;

		gsuiPopup.prompt( "Rename synthesizer", "", name, "Rename" )
			.then( name => DAW.nameSynth( id, name ) );
	};
	DOM.synthWrapper2.append( UIsynth.rootElement );
	window.synth.attached();
}
