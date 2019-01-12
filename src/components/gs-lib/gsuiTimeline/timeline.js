import React, { Component } from 'react';

export default class Timeline extends Component {
  render() {
    return (
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
    )
  }
}
