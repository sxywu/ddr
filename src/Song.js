import React, { Component } from 'react';
import _ from 'lodash';

// data
import Visualization from './Visualization';

class Song extends Component {
  constructor(props) {
    super(props);
    this.state = {
      difficulty: ['Basic', 'Trick', 'Maniac'],
      directions: ['U', 'L', 'D', 'R'],
    };
  }

  componentWillMount() {
  }

  render() {
    var style = {
      display: 'inline-block',
      margin: 10,
      padding: 20,
      boxShadow: '0 0 15px #ccc',
      verticalAlign: 'top',
    };
    var headerStyle = {
      width: 250,
      margin: 'auto',
    };
    var vizStyle = {
      width: 350,
      height: 350,
    };

    return (
      <div className="Song" style={style}>
        <div style={headerStyle}>
          <h3>{this.props.data.name}</h3>
          <p>{this.props.data.artist}</p>
        </div>
        <Visualization {...vizStyle} data={this.props.data} />
      </div>
    );
  }
}

export default Song;
