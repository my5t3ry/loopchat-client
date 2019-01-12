import React, { Component } from 'react';
export default class Panels extends Component {
  render() {
    return (
      <div className="panels">
        { this.props.children }
      </div>
    )
  }
}
