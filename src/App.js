import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';

import Song from './Song';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {songKey: songKeys[_.random(songKeys.length)]};
  }

  componentWillMount() {
    d3.json(process.env.PUBLIC_URL + 'songs.json', songs => {
      this.setState({songs});
    });
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
