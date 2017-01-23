import React, { Component } from 'react';
import _ from 'lodash';

var staffColor = '#ececec';
var dotSize = 3;
var diffSize = {Basic: 3 * dotSize, Trick: 2 * dotSize, Maniac: 1 * dotSize};
var margin = {top: 20, left: 20};
var sf = 2;

// verify Flash in the Night, Do You Remember Me, Candy, Exotic Ethnic
class Visualization extends Component {
  componentDidMount() {
    // make canvas crispy
    this.crispyCanvas(this.refs.dots, this.props, 'dots');
    this.crispyCanvas(this.refs.spiral, this.props, 'spiral');

    this.renderSteps(this.props.data, this.props);
  }

  shouldComponentUpdate(nextProps) {
    this.crispyCanvas(this.refs.dots, nextProps, 'dots');
    this.crispyCanvas(this.refs.spiral, nextProps, 'spiral');
    this.renderSteps(nextProps.data, nextProps);

    return false;
  }

  crispyCanvas(canvas, props, name) {
    canvas.width = props.width * sf;
    canvas.height = props.height * sf;
    canvas.style.width = props.width + 'px';
    canvas.style.height = props.height + 'px';
    this[name] = canvas.getContext('2d');
    this[name].scale(sf, sf);
  }

  renderSteps(levels, props) {
    dotSize = 3 * (props.expanded ? 1.5 : 1);
    var growth = 2.5 * (props.expanded ? 1.5 : 1);
    var resolution = 0.02;

    // total arc length thus far
    var totalDistance = 0;
    var centerX = props.width / 2;
    var centerY = props.height / 2;
    var prevX = centerX;
    var prevY = centerY;

    // for each level, remember the index of the step we're on
    var dataIndices = _.times(levels.length, () => 0);

    this.dots.clearRect(0, 0, props.width, props.height);
    this.dots.moveTo(centerX, centerY);
    this.dots.globalCompositeOperation = 'overlay';
    this.spiral.clearRect(0, 0, props.width, props.height);
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
        var size = diffSize[level.difficulty] * (props.expanded ? 1.5 : 1);

        if (step && totalDistance >= step[0] * dotSize) {
          // and if it's expanded, draw the second dot
          if (props.expanded && step[1][1]) {
            var x2 = centerX + (growth * angle - dotSize) * Math.cos(angle);
            var y2 = centerY + (growth * angle - dotSize) * Math.sin(angle);

            this.dots.beginPath();
            this.dots.fillStyle = 'rgba(' + props.colors(step[1][1]) + ',0.75)';
            this.dots.arc(x2, y2, size / 2, 0, 2 * Math.PI, false);
            this.dots.fill();
          }

          // if total distance has passed that particular step
          // draw it and increment the index for that level
          this.dots.beginPath();
          this.dots.fillStyle = 'rgba(' + props.colors(step[1][0]) + ',0.75)';
          this.dots.arc(x, y, size / 2, 0, 2 * Math.PI, false);
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
