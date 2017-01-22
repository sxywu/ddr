import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';

// data
import allSongs from './data/songs.json';
var songKeys = _.keys(allSongs);

import Song from './Song';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {songKey: songKeys[_.random(songKeys.length)]};
  }

  componentWillMount() {
  }

  render() {
    var songs = _.map(allSongs, data => {
      return (<Song data={data} />);
    });
    return (
      <div className="App">
        {songs}
      </div>
    );
  }
}

export default App;
