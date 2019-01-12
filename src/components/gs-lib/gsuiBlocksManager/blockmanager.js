import React, {Component} from 'react';
import gsuiBlockmManager from './gsuiBlocksManager';
import Timeline from "../gsuiTimeline/timeline.js";
import Panels from "../gsuiPanels/panels";

export default class Blockmanager extends Component {
    constructor(props) {
        super(props)
        this.p
    }

    componentDidMount() {
        this.gsuiBlockmanager = new gsuiBlockmManager(document.querySelector("#gsuiPatternroll-template"));
    }


    render() {
        return (
            <div className="blockmanager">
                <Panels/>
                <Timeline/>
                {this.props.children}
            </div>
        )
    }
}


