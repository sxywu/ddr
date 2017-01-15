import React, { Component } from 'react';
import _ from 'lodash';
import * as d3 from 'd3';
import chroma from 'chroma-js';

var colors = d3.scaleOrdinal()
  .domain(['U', 'L', 'D', 'R'])
  .range(['#e85151', '#f19b6f', '#53cf8d', '#6298e8']);
var dotSize = 5;
var perRow = 192;

// verify Flash in the Night, Do You Remember Me, Candy
class Visualization extends Component {
  componentDidMount() {
    this.container = d3.select(this.refs.container);

    this.renderSteps();
  }

  renderSteps() {
    console.log(this.props.data)

    var levels = _.filter(this.props.data.levels, level =>
      level.mode === 'Single' || level.mode === 'Double');

    this.levels = this.container.append('g')
      .attr('transform', 'translate(20,20)')
      .selectAll('.level').data(levels)
      .enter().append('g')
      .classed('level', true)
      // shift it down depending on index
      .attr('transform', (d, i) => 'translate(' + [0, i * 3 * dotSize] + ')');

    this.steps = this.levels.selectAll('.step')
      .data(d => d.steps)
      .enter().append('g')
      .classed('step', true)
      .attr('transform', d => {
        var x = (d[0] % perRow) * dotSize;
        var y = Math.floor(d[0] / perRow) * (3 * levels.length + 1) * dotSize;

        return 'translate(' + [x, y] + ')';
      });

    this.steps.selectAll('circle')
      .data(d => {
        var length = d[1].length + (d[2] ? d[2].length : 0);
        var steps = [];

        var i = -1;
        _.each(d[1], step => {
          if (step === '') return;

          steps.push({
            y: length === 1 ? 0 : i * dotSize / 2,
            fill: colors(step),
          });
          i += 2;
        });
        _.each(d[2], step => {
          if (step === '') return;

          steps.push({
            y: length === 1 ? 0 : i * dotSize / 2,
            fill: chroma(colors(step)).brighten(),
          });
          i += 2;
        });

        return steps;
      }).enter().append('circle')
      .attr('cy', d => d.y)
      .attr('r', dotSize / 2)
      .attr('fill', d => d.fill);
  }

  render() {

    return (
      <div className="Visualization">
        <svg ref='container' width={1000} height={10000} />
      </div>
    );
  }
}

export default Visualization;
