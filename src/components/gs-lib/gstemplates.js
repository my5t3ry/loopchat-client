import React, { Component } from 'react';

export default class Gstemplates extends Component {
  render() {
    return (
      <div className="gstemplates">
        <div id="app" className="gsuiPanels-x">
          <div className="gsuiPanels-y no-select" id="pan-leftside" data-width-class="<215:small <180:tiny">
            <div className="panel-left" id="pan-cmps"></div>
            <div className="panel-left" id="pan-history"></div>
            <div className="panel-left" id="pan-patterns"></div>
          </div>
          <div className="gsuiPanels-y" id="pan-rightside">
            <div id="pan-maingrid"></div>
            <div className="gsuiPanels-x">
              <div className="pan-synth-pianoroll no-select" id="pan-synth"></div>
              <div className="pan-synth-pianoroll" id="pan-pianoroll"></div>
            </div>
          </div>
        </div>
        <div data-panel="pan-cmps">
          <div className="panel-title">
            <div id="title"></div>
            <a id="signup" target="_blank" rel="noopener" title="A sign-up Google form" href="https://docs.google.com/forms/d/17cMQtfQ8QmP2Cj1qAxXsUpuo3Rr1fF8hmFPZroSDvq0"></a>
            <div id="appGainWrap" title="Main app volume (this parameter will not affect the rendering)"></div>
          </div>
          <div className="panel-menu"><a href id="newComposition" className="cmps-btn" data-text="New" title="Create a new composition (Alt + N)"></a><a href id="openComposition" className="cmps-btn" data-text="Open" title="Open a composition (Ctrl + O)"></a><a href id="renderComposition" className="cmps-btn" data-text="Render" title="Render the composition"></a></div>
          <div id="cmps" className="panel-body nice-scrollbar"></div>
        </div>
        <div data-panel="pan-history">
          <div className="panel-title"><span className="icon ico-history"></span><span>History</span></div>
          <div className="panel-menu"><a id="undo" className="icon ico-undo panel-btn" title="Undo the previous action (Ctrl + Z)"></a><a id="redo" className="icon ico-redo panel-btn" title="Redo the next action (Ctrl + Shift + Z)"></a></div>
          <div id="history" className="panel-body nice-scrollbar"></div>
        </div>
        <div data-panel="pan-patterns">
          <div className="panel-title"><span className="icon ico-synth"></span><span>Synthesizers</span></div>
          <div className="panel-menu"><a id="synthNew" className="icon ico-new panel-btn" title="Create a new synthesizer"></a></div>
          <div id="patterns" className="panel-body nice-scrollbar"></div>
        </div>
        <div data-panel="pan-maingrid">
          <div id="controls" className="no-select"><a tabIndex="2" id="togglePlay" title="Switch grid focus" className="ctrl-item" href></a>
            <button tabIndex="3" id="play" className="ctrl-item ctrl-btn icon ico-play"></button>
            <button tabIndex="4" id="stop" className="ctrl-item ctrl-btn icon ico-stop"></button>
            <div id="clock" className="ctrl-item">
              <div id="clockMin"></div>
              <div id="clockSec"></div>
              <div id="clockMs"></div>
            </div>
            <div id="bpm" className="ctrl-item"><span id="bpmNumber"></span><span id="bpmText"></span></div>
            <div id="analyser" className="ctrl-item"></div>
            <button tabIndex="5" id="settings" className="ctrl-item ctrl-btn"></button>
            <button tabIndex="6" id="eatCookies" className="ctrl-item ctrl-btn"><i className="icon"></i><span>accept our<br/>cookies</span></button>
            <button tabIndex="7" id="shortcuts" title="Shortcuts" className="ctrl-item ctrl-btn icon ico-keyboard"></button>
            <a tabIndex="8" id="help" title="Help" className="ctrl-item ctrl-btn icon ico-help" target="_blank" rel="noopener" href="https://github.com/gridsound/daw/wiki/help"></a>
            <button tabIndex="9" id="about" title="About" className="ctrl-item ctrl-btn icon ico-rocket"></button>
          </div>
          <div id="mainGridWrap"></div>
        </div>
        <div data-panel="pan-mixer"></div>
        <div data-panel="pan-synth">
          <div className="pan-menu">
            <div className="pan-name" id="synthName"></div>
          </div>
          <div id="synthWrapper">
            <div id="synthWrapper2"></div>
          </div>
        </div>
        <div data-panel="pan-pianoroll">
          <div className="pan-menu no-select">
            <div className="pan-name" id="pianorollName"></div>
          </div>
          <div id="keysGridWrap"></div>
          <div id="pianorollBlock" className="no-select"></div>
        </div>
        <div className="popup" id="openPopupContent" data-remove>
          <fieldset>
            <legend>Open and load a new composition</legend>
            <div className="param">
              <div className="param-title">With an URL</div>
              <div className="param-values"><input id="inputOpenURL" type="url" placeholder="http://"/></div>
            </div>
            <div className="param">
              <div className="param-title">With a local file<br/>
                <small>(Please notice that you can also drop a file into the app)</small>
              </div>
              <div className="param-values"><input id="inputOpenFile" type="file"/></div>
            </div>
          </fieldset>
        </div>
        <div className="popup" id="aboutPopupContent" data-remove>
          <div className="title"><span>GridSound</span><span id="version"><span id="versionNumber"></span><span id="versionCheck">check the version</span></span></div>
          <div>GridSound is a (work-in-progress) free browser-based digital audio workstation following the Web Audio API.</div>
          <div>There are more information <a className="info" target="_blank" rel="noopener" href="/">here</a> and this <a aria-label="Read the changelog" target="_blank" rel="noopener" href="https://github.com/gridsound/daw/wiki/changelog">changelog</a> will describe what's new after an update.You can donate to help us on our <a className="patreon" target="_blank" rel="noopener" href="https://patreon.com/gridsound">Patreon</a>.</div>
          <div className="social-network"><a target="_blank" rel="noopener" href="https://github.com/gridsound" title="Github" className="ico-brand ico-github"></a><a target="_blank" rel="noopener" href="https://twitter.com/gridsound" title="Twitter" className="ico-brand ico-twitter"></a><a target="_blank" rel="noopener" href="https://www.youtube.com/channel/UC2-jebT7TS8xJgJPymXqatA" title="YouTube" className="ico-brand ico-youtube"></a><a target="_blank" rel="noopener" href="https://facebook.com/gridsound" title="Facebook" className="ico-brand ico-facebook"></a><a target="_blank" rel="noopener" href="https://codepen.io/gridsound" title="CodePen" className="ico-brand ico-codepen"></a><a target="_blank" rel="noopener" href="https://discord.gg/NUYxHAg" title="Discord" className="ico-brand ico-discord"></a></div>
        </div>
        <div className="popup" id="renderPopupContent" data-remove>
          <fieldset>
            <legend>Render the current composition</legend>
            <div id="renderWrap"><a href id="renderBtn"><span id="renderBtn0">Render</span><span id="renderBtn1">Rendering...</span><span id="renderBtn2">Download WAV file</span></a>
              <progress id="renderProgress" value="" max="1"></progress>
            </div>
          </fieldset>
        </div>
        <div className="popup" id="settingsPopupContent" data-remove>
          <fieldset>
            <legend>GridSound's DAW settings</legend>
            <div className="param">
              <div className="param-title">Clock display</div>
              <div className="param-values"><label><input id="settingsInputClockSec" name="clock" type="radio"/> min:sec.ms</label><br/><label><input id="settingsInputClockBeat" name="clock" type="radio"/> beats:steps.milisteps</label></div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Composition settings</legend>
            <div className="param">
              <div className="param-title">Title</div>
              <div className="param-values"><input id="settingsInputName" type="text" placeholder="untitled"/></div>
            </div>
            <div className="param">
              <div className="param-title">BPM</div>
              <div className="param-values"><input id="settingsInputBPM" type="number" min="1" max="999"/><span id="settingsBPMTap" className="btn icon ico-tint"></span></div>
            </div>
            <div className="param">
              <div className="param-title">Beats per measure</div>
              <div className="param-values"><input id="settingsInputBeatsPM" type="number" min="1" max="16"/></div>
            </div>
            <div className="param">
              <div className="param-title">Steps per beat</div>
              <div className="param-values"><input id="settingsInputStepsPB" type="number" min="1" max="16"/></div>
            </div>
          </fieldset>
        </div>
        <div className="popup" id="shortcutsPopupContent" data-remove>
          <fieldset>
            <legend>Global shortcuts</legend>
            <div className="param">
              <div className="param-title">Open a composition</div>
              <div className="param-values"><span className="shortcuts">Ctrl / Alt</span>+<span className="shortcuts">O</span></div>
            </div>
            <div className="param">
              <div className="param-title">Open a new composition</div>
              <div className="param-values"><span className="shortcuts">Alt</span>+<span className="shortcuts">N</span></div>
            </div>
            <div className="param">
              <div className="param-title">Play / pause the selected grid</div>
              <div className="param-values"><span className="shortcuts">Space</span></div>
            </div>
            <div className="param">
              <div className="param-title">Undo the previous action</div>
              <div className="param-values"><span className="shortcuts">Ctrl / Alt</span>+<span className="shortcuts">Z</span></div>
            </div>
            <div className="param">
              <div className="param-title">Redo the next action</div>
              <div className="param-values"><span className="shortcuts">Ctrl / Alt</span>+<span className="shortcuts">Shift</span>+<span className="shortcuts">Z</span></div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Grids shortcuts</legend>
            <div className="param">
              <div className="param-title">Select all the blocks of the focused grid</div>
              <div className="param-values"><span className="shortcuts">Ctrl / Alt</span>+<span className="shortcuts">A</span></div>
            </div>
            <div className="param">
              <div className="param-title">Deselect all the blocks of the focused grid</div>
              <div className="param-values"><span className="shortcuts">Ctrl / Alt</span>+<span className="shortcuts">D</span></div>
            </div>
            <div className="param">
              <div className="param-title">Duplicate (copy/paste) the selected blocks</div>
              <div className="param-values"><span className="shortcuts">Ctrl / Alt</span>+<span className="shortcuts">B</span></div>
            </div>
            <div className="param">
              <div className="param-title">Delete all the selected blocks of the focused grid</div>
              <div className="param-values"><span className="shortcuts">Delete</span></div>
            </div>
            <div className="param">
              <div className="param-title">Move vertically inside the grids</div>
              <div className="param-values"><span className="shortcuts">Scroll <i className="icon ico-arrows-v"></i></span></div>
            </div>
            <div className="param">
              <div className="param-title">Move horizontally inside the grids</div>
              <div className="param-values"><span className="shortcuts">Shift</span>+<span className="shortcuts">Scroll <i className="icon ico-arrows-v"></i></span></div>
            </div>
            <div className="param">
              <div className="param-title">Zoom-in / zoom-out<br/>Zoom X by scrolling above the grid<br/>Zoom Y by scrolling above the keys<br/></div>
              <div className="param-values"><span className="shortcuts">Ctrl / <i className="icon ico-cmd"></i></span>+<span className="shortcuts">Scroll <i className="icon ico-arrows-v"></i></span></div>
            </div>
          </fieldset>
        </div>
        <div className="cmp" id="cmp" data-remove-id>
          <div data-action="save" className="cmp-save"></div>
          <div data-action="open" className="cmp-info">
            <div className="cmp-name"></div>
            <div><span className="cmp-bpm"></span><span className="cmp-duration"></span></div>
          </div>
          <a data-action="json" className="cmp-btn cmp-jsonExport" title="Export to JSON file"></a><a data-action="delete" className="cmp-btn cmp-delete" title="Delete"></a></div>
        <div id="synth" className="synth" data-remove data-remove-id>
          <div className="synth-head"><a data-action="expand" className="synth-showBtn icon ico-caret-right"></a><a className="synth-name"></a><a data-action="newPattern" className="synth-hoverBtn synth-newPatternBtn icon ico-new" title="Create a new pattern with this synthesizer"></a><a data-action="delete" className="synth-hoverBtn synth-deleteBtn icon ico-remove" title="Delete the synthesizer and its patterns"></a></div>
          <div className="synth-patterns nice-scrollbar"></div>
        </div>
        <div id="pattern" className="pattern" draggable="true">
          <div className="pattern-head">
            <div className="pattern-name"></div>
            <a data-action="clone" className="pattern-clone icon ico-clone" title="Clone this pattern"></a><a data-action="remove" className="pattern-remove icon ico-remove" title="Delete this pattern"></a></div>
          <div className="pattern-content"></div>
        </div>
        <div className="historyAction" id="historyAction"><span className="historyAction-icon icon"></span><span className="historyAction-text"></span></div>
        <div className="gsuiMixer" id="gsuiMixer-template">
          <div className="gsuiMixer-panMaster"></div>
          <div className="gsuiMixer-panChannels"></div>
          <div className="gsuiMixer-panEffects"></div>
        </div>
        <div className="gsuiMixerChannel" id="gsuiMixerChannel-template">
          <div className="gsuiMixerChannel-ctrl gsuiMixerChannel-nameWrap"><span className="gsuiMixerChannel-name"></span></div>
          <div className="gsuiMixerChannel-analyserWrap">
            <canvas className="gsuiMixerChannel-analyser"></canvas>
          </div>
          <button className="gsuiMixerChannel-ctrl gsuiMixerChannel-toggle"></button>
          <div className="gsuiMixerChannel-ctrl gsuiMixerChannel-pan"></div>
          <div className="gsuiMixerChannel-ctrl gsuiMixerChannel-gain"></div>
        </div>
        <div className="gsuiDragline" id="gsuiDragline-template">
          <div className="gsuiDragline-main">
            <svg className="gsuiDragline-line" xmlns="http://www.w3.org/2000/svg">
              <polyline/>
            </svg>
            <div className="gsuiDragline-to"></div>
          </div>
        </div>
        <div id="gsuiPatternroll-template" className="gsuiBlocksManager gsuiPatternroll gsuiPanels-x" tabIndex="-1">
          <div className="gsuiBlocksManager-sidePanel">
            <div className="gsuiBlocksManager-sidePanelMenu"><a href className="gsuiBlocksManager-magnet gsui-opacityHover"><span className="gsuiBlocksManager-magnetValue"></span></a></div>
            <div className="gsuiBlocksManager-sidePanelContent"></div>
          </div>
          <div className="gsuiBlocksManager-gridPanel">
            <div className="gsuiBlocksManager-timelineWrap"></div>
            <div className="gsuiBlocksManager-rowsWrapout">
              <div className="gsuiBlocksManager-rows gsuiBeatlines">
                <div className="gsuiBlocksManager-rowsWrapin">
                  <div className="gsuiBlocksManager-selection gsuiBlocksManager-selection-hidden"></div>
                  <div className="gsuiBlocksManager-currentTime"></div>
                  <div className="gsuiBlocksManager-loop gsuiBlocksManager-loopA"></div>
                  <div className="gsuiBlocksManager-loop gsuiBlocksManager-loopB"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="gsuiPatternroll-block-template" className="gsuiBlocksManager-block gsuiPatternroll-block">
          <div className="gsuiBlocksManager-block-crop gsuiBlocksManager-block-cropA"></div>
          <div className="gsuiBlocksManager-block-crop gsuiBlocksManager-block-cropB"></div>
          <div className="gsuiPatternroll-block-header"></div>
          <div className="gsuiPatternroll-block-content"></div>
        </div>
        <div id="gsuiPianoroll-template" className="gsuiBlocksManager gsuiPianoroll gsuiPanels-x" tabIndex="-1">
          <div className="gsuiBlocksManager-sidePanel gsuiPanels-y">
            <div className="gsuiPianoroll-sidePanelTop">
              <div className="gsuiBlocksManager-sidePanelMenu"><a href className="gsuiBlocksManager-magnet gsui-opacityHover"><span className="gsuiBlocksManager-magnetValue"></span></a></div>
              <div className="gsuiBlocksManager-sidePanelContent"></div>
            </div>
            <div className="gsuiPianoroll-sidePanelBottom"><select className="gsuiPianoroll-slidersSelect gsui-opacityHover">
              <option value="gain">gain</option>
              <option value="pan">pan</option>
            </select></div>
          </div>
          <div className="gsuiBlocksManager-gridPanel gsuiPanels-y">
            <div className="gsuiPianoroll-gridPanelTop">
              <div className="gsuiBlocksManager-timelineWrap"></div>
              <div className="gsuiBlocksManager-rowsWrapout">
                <div className="gsuiBlocksManager-rows gsuiBeatlines">
                  <div className="gsuiBlocksManager-rowsWrapin">
                    <div className="gsuiBlocksManager-selection gsuiBlocksManager-selection-hidden"></div>
                    <div className="gsuiBlocksManager-currentTime"></div>
                    <div className="gsuiBlocksManager-loop gsuiBlocksManager-loopA"></div>
                    <div className="gsuiBlocksManager-loop gsuiBlocksManager-loopB"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="gsuiPianoroll-gridPanelBottom"></div>
          </div>
        </div>
        <div className="gsuiBlocksManager-block" id="gsuiPianoroll-block-template">
          <div className="gsuiDragline-drop"></div>
          <div className="gsuiBlocksManager-block-crop gsuiBlocksManager-block-cropB"></div>
        </div>
        <div className="gsuiPianoroll-slider" id="gsuiPianoroll-slider-template">
          <div className="gsuiPianoroll-sliderInner"></div>
        </div>
        <div id="gsuiKeys-octave-template">
          <div data-key="11" className="gsuiKey">
            <div data-key="11" className="gsui-row gsuiKey-row">
              <div></div>
            </div>
          </div>
          <div data-key="10" className="gsuiKey gsuiKeyBlack">
            <div data-key="10" className="gsui-row gsuiKey-row gsuiKeyBlack-row">
              <div></div>
            </div>
          </div>
          <div data-key="9" className="gsuiKey">
            <div data-key="9" className="gsui-row gsuiKey-row">
              <div></div>
            </div>
          </div>
          <div data-key="8" className="gsuiKey gsuiKeyBlack">
            <div data-key="8" className="gsui-row gsuiKey-row gsuiKeyBlack-row">
              <div></div>
            </div>
          </div>
          <div data-key="7" className="gsuiKey">
            <div data-key="7" className="gsui-row gsuiKey-row">
              <div></div>
            </div>
          </div>
          <div data-key="6" className="gsuiKey gsuiKeyBlack">
            <div data-key="6" className="gsui-row gsuiKey-row gsuiKeyBlack-row">
              <div></div>
            </div>
          </div>
          <div data-key="5" className="gsuiKey">
            <div data-key="5" className="gsui-row gsuiKey-row">
              <div></div>
            </div>
          </div>
          <div data-key="4" className="gsuiKey">
            <div data-key="4" className="gsui-row gsuiKey-row">
              <div></div>
            </div>
          </div>
          <div data-key="3" className="gsuiKey gsuiKeyBlack">
            <div data-key="3" className="gsui-row gsuiKey-row gsuiKeyBlack-row">
              <div></div>
            </div>
          </div>
          <div data-key="2" className="gsuiKey">
            <div data-key="2" className="gsui-row gsuiKey-row">
              <div></div>
            </div>
          </div>
          <div data-key="1" className="gsuiKey gsuiKeyBlack">
            <div data-key="1" className="gsui-row gsuiKey-row gsuiKeyBlack-row">
              <div></div>
            </div>
          </div>
          <div data-key="0" className="gsuiKey">
            <div data-key="0" className="gsui-row gsuiKey-row">
              <div></div>
            </div>
          </div>
        </div>
        <div id="gsuiOscillator-template" className="gsuiOscillator">
          <div className="gsuiOscillator-order"></div>
          <div className="gsuiOscillator-attr gsuiOscillator-type">
            <div className="gsuiOscillator-typeWaves"></div>
            <div className="gsuiOscillator-typeCtrl"><a className="gsuiOscillator-typeLink gsuiOscillator-typePrev" title="Previous wave"></a><a className="gsuiOscillator-typeLink gsuiOscillator-typeNext" title="Next wave"></a><select>
              <option value="sine" className="gsuiOscillator-nativeWave">sine</option>
              <option value="triangle" className="gsuiOscillator-nativeWave">triangle</option>
              <option value="sawtooth" className="gsuiOscillator-nativeWave">sawtooth</option>
              <option value="square" className="gsuiOscillator-nativeWave">square</option>
            </select></div>
          </div>
          <div className="gsuiOscillator-attr gsuiOscillator-detune" data-filter="detune" title="detune">
            <div className="gsuiOscillator-sliderValue"></div>
            <div className="gsuiOscillator-sliderWrap"></div>
          </div>
          <div className="gsuiOscillator-attr gsuiOscillator-pan" data-filter="pan" title="pan">
            <div className="gsuiOscillator-sliderValue"></div>
            <div className="gsuiOscillator-sliderWrap"></div>
          </div>
          <div className="gsuiOscillator-attr gsuiOscillator-gain" data-filter="gain" title="gain">
            <div className="gsuiOscillator-sliderValue"></div>
            <div className="gsuiOscillator-sliderWrap"></div>
          </div>
          <a className="gsuiOscillator-remove" title="Remove the oscillator"></a></div>
        <div id="gsuiSynthesizer-template" className="gsuiSynthesizer"><span className="gsuiSynthesizer-title">Oscillators</span>
          <div className="gsuiSynthesizer-head">
            <div>#</div>
            <div>wave</div>
            <div>detune</div>
            <div>pan</div>
            <div>gain</div>
          </div>
          <div className="gsuiSynthesizer-oscList"></div>
          <a className="gsuiSynthesizer-newOsc"></a></div>
        <div id="gsuiPopup">
          <div id="gsuipp-window" tabIndex="0">
            <div id="gsuipp-head"></div>
            <form id="gsuipp-body">
              <div id="gsuipp-cnt"></div>
              <div id="gsuipp-msg"></div>
              <input type="text" id="gsuipp-inpText"/>
              <div id="gsuipp-btns"><input type="button" id="gsuipp-inpCancel" value="Cancel"/><input type="submit" id="gsuipp-inpOk" value="Ok"/></div>
            </form>
          </div>
        </div>
        <div id="gsuiSlider-template" className="gsuiSlider"><input type="range"/>
          <div className="gsui-line">
            <div className="gsui-lineColor"></div>
          </div>
          <svg>
            <circle className="gsui-svgLine"/>
            <circle className="gsui-svgLineColor"/>
          </svg>
          <div className="gsui-eventCatcher"></div>
        </div>
        <div id="gsuiSliderGroup-template" className="gsuiSliderGroup">
          <div className="gsuiSliderGroup-scale"><span></span><span></span><span></span></div>
          <div className="gsuiSliderGroup-slidersWrap">
            <div className="gsuiSliderGroup-sliders gsuiBeatlines">
              <div className="gsuiSliderGroup-currentTime"></div>
              <div className="gsuiSliderGroup-loop gsuiSliderGroup-loopA"></div>
              <div className="gsuiSliderGroup-loop gsuiSliderGroup-loopB"></div>
            </div>
          </div>
        </div>
        <div id="gsuiSliderGroup-slider-template" className="gsuiSliderGroup-slider">
          <div className="gsuiSliderGroup-sliderInner"></div>
        </div>
        <div className="gsuiTimeline" id="gsuiTimeline-template">
          <div className="gsuiTimeline-loopLine">
            <div className="gsuiTimeline-loop">
              <div className="gsuiTimeline-loopExt gsuiTimeline-loopA"></div>
              <div className="gsuiTimeline-loopExt gsuiTimeline-loopB"></div>
              <div className="gsuiTimeline-loopBrd gsuiTimeline-loopBrdA"></div>
              <div className="gsuiTimeline-loopBrd gsuiTimeline-loopBrdB"></div>
              <div className="gsuiTimeline-loopBg"></div>
            </div>
          </div>
          <svg className="gsuiTimeline-cursorPreview gsui-hidden" width="16" height="10">
            <polygon points="2,2 8,8 14,2"/>
          </svg>
          <svg className="gsuiTimeline-cursor" width="16" height="10">
            <polygon points="2,2 8,8 14,2"/>
          </svg>
          <div className="gsuiTimeline-currentTime"></div>
        </div>
        <div id="gsuiTrack-template" className="gsuiTrack">
          <div className="gsuiTrack-toggle"></div>
          <div className="gsuiTrack-nameWrap"><input className="gsuiTrack-name" type="text" spellCheck="false"/></div>
          <div className="gsui-row gsuiTrack-row">
            <div></div>
          </div>
        </div>
        <div id="gsuiTracklist-template" className="gsuiTracklist"></div>
      </div>
    )
  }
}
