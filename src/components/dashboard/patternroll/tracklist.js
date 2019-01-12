import React, {Component} from 'react';
import gsuiTracklist from './gsuiTracklist'

export default class Tracklist extends Component {
    componentDidMount() {
        this.gsuitracklist = new gsuiTracklist();
    }

    render() {
        return (
            <div className="tracklist">
                {this.props.children}
                <div id="gsuiTracklist-template" className="gsuiTracklist"></div>
            </div>
        )
    }
}
