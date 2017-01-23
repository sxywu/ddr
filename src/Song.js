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


  renderArrows() {
    var size = 12;
    return _.map([['←', 'L'], ['↑', 'U'], ['→', 'R'], ['↓', 'D']], data => {
      var [arrow, direction] = data;
      var includes = _.includes(this.state.directions, direction);
      var color = 'rgb(' + this.props.colors(direction) + ')';

      var style = {
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: includes ? color : '#fff',
        color: includes? '#fff' : color,
        fontWeight: 800,
        fontSize: size * 0.75,
        verticalAlign: 'top',
        padding: 5,
        margin: 5,
        cursor: 'pointer',
      };
      return (
        <span className='header' style={style}
          onClick={this.filterDirection.bind(this, direction)}>
          {arrow}
        </span>
      );
    });
  }

  renderDifficulties() {
    var size = 12;
    var dotSize = 3;
    return _.map([['3', 'Basic'], ['2', 'Trick'], ['1', 'Maniac']], data => {
      var [multiple, difficulty] = data;
      var includes = _.includes(this.state.difficulties, difficulty);
      var color = '#999';

      var style = {
        fontWeight: 800,
        fontSize: size,
        padding: 5,
        margin: 5,
        cursor: 'pointer',
      };
      var dotStyle = {
        display: 'inline-block',
        lineHeight: size,
        verticalAlign: 'middle',
        width: dotSize * multiple,
        height: dotSize * multiple,
        borderRadius: dotSize * multiple,
        backgroundColor: includes ? color : '#fff',
        border: includes? '#fff' : color,
        margin: 5,
      };
      return (
        <span className='header' style={style}
          onClick={this.filterDifficulty.bind(this, difficulty)}>
          <span style={dotStyle} />
          {difficulty}
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
      width: 250,
      margin: 'auto',
    };
    var vizStyle = {
      width: 350,
      height: 350,
    };

    var levels = _.map(this.state.levels, level => {
      return Object.assign({}, level, {
        steps: _.filter(level.steps, step => _.includes(this.state.directions, step[1][0])),
      });
    });

    return (
      <div className="Song" style={style}>
        <div style={headerStyle}>
          <h3>{this.props.data.name}</h3>
          <p>{this.props.data.artist}</p>
          <p>{this.renderArrows()}</p>
          <p>{this.renderDifficulties()}</p>
        </div>
        <Visualization {...vizStyle} {...this.props} data={levels} />
      </div>
    );
  }
}

export default Song;
