import React, { Component } from 'react';
import _ from 'lodash';

// data
import Visualization from './Visualization';

class Song extends Component {

  constructor(props) {
    super(props);
    this.state = {
      levels: [],
      difficulty: ['Basic', 'Trick', 'Maniac'],
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

    var size = 14;
    var arrows = _.map([['←', 'L'], ['↑', 'U'], ['→', 'R'], ['↓', 'D']], data => {
      var [arrow, direction] = data;
      var includes = _.includes(this.state.directions, direction);
      var color = 'rgb(' + this.props.colors(direction) + ')';

      var arrowStyle = {
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
        <span className='header' style={arrowStyle}
          onClick={this.filterDirection.bind(this, direction)}>
          {arrow}
        </span>
      );
    });

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
        </div>
        <div>
          {arrows}
        </div>
        <Visualization {...vizStyle} {...this.props} data={levels} />
      </div>
    );
  }
}

export default Song;
