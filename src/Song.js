import React, { Component } from 'react';
import _ from 'lodash';

// data
import Visualization from './Visualization';

class Song extends Component {

  constructor(props) {
    super(props);
    this.state = {
      levels: [],
      difficulties: ['Basic', 'Trick', 'Maniac'],
      directions: ['U', 'R', 'D', 'L'],
    };
  }

  componentWillMount() {
    var levels = _.chain(this.props.data.levels)
      .filter(level => level.mode === 'Single')
      .sortBy(level => level.difficulty === 'Basic' ? 0 :
        level.difficulty === 'Trick' ? 1 : 2)
      .value();

    this.setState({levels});
  }

  filterDirection(direction) {
    var directions = this.state.directions;
    if (_.includes(directions, direction)) {
      directions = _.without(directions, direction);
    } else {
      directions.push(direction);
    }
    this.setState({directions});
  }

  filterDifficulty(difficulty) {
    var difficulties = this.state.difficulties;
    if (_.includes(difficulties, difficulty)) {
      difficulties = _.without(difficulties, difficulty);
    } else {
      difficulties.push(difficulty);
    }
    this.setState({difficulties});
  }

  renderArrows(levels) {
    var size = 12;
    return _.map([['←', 'L'], ['↑', 'U'], ['→', 'R'], ['↓', 'D']], data => {
      var [arrow, direction] = data;
      var includes = _.includes(this.state.directions, direction);
      var color = 'rgb(' + this.props.colors(direction) + ')';
      var count = _.reduce(levels, (sum, level) => {
        return sum + (_.countBy(level.steps, step => step[1][0])[direction] || 0);
      }, 0);

      var style = {
        padding: 5,
        fontSize: 10,
        verticalAlign: 'middle',
        cursor: 'pointer',
      };
      var dotStyle = {
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: includes ? color : '#fff',
        color: includes? '#fff' : color,
        fontSize: size * 0.75,
        fontWeight: 800,
        padding: 5,
        margin: 5,
      };
      return (
        <span className='tnum lnum' style={style}
          onClick={this.filterDirection.bind(this, direction)}>
          <span className='header' style={dotStyle}>{arrow}</span>
          {count}
        </span>
      );
    });
  }

  renderDifficulties(levels) {
    var size = 12;
    var dotSize = 3;
    return _.map([['3', 'Basic'], ['2', 'Trick'], ['1', 'Maniac']], data => {
      var [multiple, difficulty] = data;
      var includes = _.includes(this.state.difficulties, difficulty);
      var color = '#999';
      var count = _.find(levels, level => level.difficulty === difficulty);
      count = count ? count.steps.length : 0;

      var style = {
        fontSize: 10,
        padding: 5,
        cursor: 'pointer',
      };
      var dotStyle = {
        display: 'inline-block',
        lineHeight: size,
        verticalAlign: 'middle',
        width: includes ? dotSize * multiple : dotSize,
        height: includes ? dotSize * multiple : dotSize,
        borderRadius: includes ? dotSize * multiple : dotSize,
        backgroundColor: includes ? color : '#fff',
        border: includes? 'none' : '2px solid' + color,
        margin: 5,
      };
      var headerStyle = {
        fontWeight: 800,
        fontSize: size,
      };
      return (
        <span className='tnum lnum' style={style}
          onClick={this.filterDifficulty.bind(this, difficulty)}>
          <span style={dotStyle} />
          <span className='header' style={headerStyle}>{difficulty} </span>
          {count}
        </span>
      );
    });
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
      width: 300,
      margin: 'auto',
    };
    var vizStyle = {
      width: 350,
      height: 350,
    };

    var levels = _.chain(this.state.levels)
      .filter(level => _.includes(this.state.difficulties, level.difficulty))
      .map(level => {
        return Object.assign({}, level, {
          steps: _.filter(level.steps, step => _.includes(this.state.directions, step[1][0])),
        });
      }).value();

    return (
      <div className="Song" style={style}>
        <div style={headerStyle}>
          <h3>{this.props.data.name}</h3>
          <p>{this.props.data.artist}</p>
          <p>{this.renderArrows(levels)}</p>
          <p>{this.renderDifficulties(levels)}</p>
        </div>
        <Visualization {...vizStyle} {...this.props} data={levels} />
      </div>
    );
  }
}

export default Song;
