import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';

// data
import allSongs from './data/songs.json';
var songKeys = _.keys(allSongs);

import Visualization from './Visualization';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {songKey: songKeys[_.random(songKeys.length)]};
  }

  componentWillMount() {
  }

  render() {
    return (
      <div className="App">
        <Visualization data={allSongs[this.state.songKey]} />
      </div>
    );
  }
}

export default App;
