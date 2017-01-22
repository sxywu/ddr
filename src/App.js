import React, { Component } from 'react';
import _ from 'lodash';
import * as d3 from 'd3';
import './App.css';

import Header from './Header';
import Song from './Song';

var colors = d3.scaleOrdinal()
  .domain(['U', 'L', 'D', 'R'])
  // .range(['#e85151', '#f19b6f', '#53cf8d', '#6298e8']);
  .range([
    [232,81,120],
    [244,180,121],
    [98,152,232],
    [83,207,141],
    // [232, 81, 81],
    // [241, 155, 111],
    // [83, 207, 141],
    // [98, 152, 232]
  ]);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: [],
    };
  }

  componentWillMount() {
    d3.json(process.env.PUBLIC_URL + 'songs.json', songs => {
      this.setState({songs});
    });
  }

  render() {
    var props = {
      colors,
    };

    var songs = _.map(this.state.songs, data => {
      return (<Song {...props} data={data} />);
    });
    return (
      <div className="App">
        <Header />
        {songs}
      </div>
    );
  }
}

export default App;
