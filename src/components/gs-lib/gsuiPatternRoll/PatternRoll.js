import React, {Component} from 'react';
import gsuiPatternroll from "./gsuiPatternroll";
import Tracklist from "../gsuiTracklist/tracklist";
import Blockmanager from "../gsuiBlocksManager/blockmanager";

export default class PatternRoll extends Component {


    constructor(props) {
        super(props);

    }

    checkDom() {
        return new Promise(function (resolve, reject) {
            function step() {
                if (document.querySelector("#gsuiPatternroll-template") != null &&
                    document.querySelector("#gsuiTimeline-template") != null &&
                    document.querySelector("#gsuiTracklist-template") != null
                ) {
                    resolve();
                } else {
                    window.requestAnimationFrame(step);
                }
            }

            window.requestAnimationFrame(step);
        });
    }


    componentDidMount() {
        this.checkDom().then(function () {
            patternrol : new gsuiPatternroll()
        })
    }

    render() {
        return (
            <React.Fragment>
                <Blockmanager/>
                <Tracklist ref="tracklist"/>
                {this.props.children}
                <div id="gsuiPatternroll-template" className="gsuiBlocksManager gsuiPatternroll gsuiPanels-x" tabIndex="-1">
                    <div className="gsuiBlocksManager-sidePanel">
                        <div className="gsuiBlocksManager-sidePanelMenu">
                            <a className="gsuiBlocksManager-magnet gsui-opacityHover">
                                <span className="gsuiBlocksManager-magnetValue"></span>
                            </a>
                        </div>
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

            </React.Fragment>

        )
    }
}