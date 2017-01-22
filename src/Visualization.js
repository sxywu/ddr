import React, { Component } from 'react';
import _ from 'lodash';
import * as d3 from 'd3';

var staffColor = '#ececec';
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
var dotSize = 3;
var diffSize = {Basic: 3 * dotSize, Trick: 2 * dotSize, Maniac: 1 * dotSize};
var margin = {top: 20, left: 20};
var sf = 2;

// verify Flash in the Night, Do You Remember Me, Candy, Exotic Ethnic
class Visualization extends Component {
  componentDidMount() {
    // make canvas crispy
    this.crispyCanvas(this.refs.dots, 'dots');
    this.crispyCanvas(this.refs.spiral, 'spiral');

    var levels = _.chain(this.props.data.levels)
      .filter(level => level.mode === 'Single')
      // .filter(level => level.mode === 'Single' || level.mode === 'Double')
      .sortBy(level => level.difficulty === 'Basic' ? 0 :
        level.difficulty === 'Trick' ? 1 : 2)
      .value();
    this.renderSteps(levels);
  }

  crispyCanvas(canvas, name) {
    canvas.width = this.props.width * sf;
    canvas.height = this.props.height * sf;
    canvas.style.width = this.props.width + 'px';
    canvas.style.height = this.props.height + 'px';
    this[name] = canvas.getContext('2d');
    this[name].scale(sf, sf);
  }

  renderSteps(levels) {
    var growth = 2.5;
    var resolution = 0.02;

    // total arc length thus far
    var totalDistance = 0;
    var centerX = this.props.width / 2;
    var centerY = this.props.height / 2;
    var prevX = centerX;
    var prevY = centerY;

    // for each level, remember the index of the step we're on
    var dataIndices = _.times(levels.length, () => 0);

    this.dots.clearRect(0, 0, this.props.width, this.props.height);
    this.dots.moveTo(centerX, centerY);
    this.dots.globalCompositeOperation = 'overlay';
    this.spiral.clearRect(0, 0, this.props.width, this.props.height);
    this.spiral.moveTo(centerX, centerY);
    this.spiral.beginPath();
    // while even one of the levels have steps left
    var angle = 0;
    while (_.some(dataIndices, (d, i) => levels[i].steps[d])) {
      angle += (resolution * .9);
      var x = centerX + growth * angle * Math.cos(angle);
      var y = centerY + growth * angle * Math.sin(angle);

      this.spiral.lineTo(x, y);

      var distance = Math.sqrt(Math.pow(prevX - x, 2) + Math.pow(prevY - y, 2));
      totalDistance += distance;

      _.each(levels, (level, i) => {
        var step = level.steps[dataIndices[i]];

        if (step && totalDistance >= step[0] * dotSize) {
          // if total distance has passed that particular step
          // draw it and increment the index for that level
          this.dots.beginPath();
          this.dots.fillStyle = 'rgba(' + colors(step[1][0]) + ',0.75)';
          this.dots.arc(x, y, diffSize[level.difficulty] / 2, 0, 2 * Math.PI, false);
          this.dots.fill();

          dataIndices[i] += 1;
        }
      });

      prevX = x;
      prevY = y;
    }

    this.spiral.strokeStyle = staffColor;
    this.spiral.stroke();
  }

  render() {
    var style = {
      position: 'relative',
    };
    var canvasStyle = {
      position: 'absolute',
      left: 0,
    };

    return (
      <div style={style}>
        <canvas ref='spiral' />
        <canvas ref='dots' style={canvasStyle} />
      </div>
    );
  }
}

export default Visualization;
