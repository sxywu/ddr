import React, { Component } from 'react';
import _ from 'lodash';
import * as d3 from 'd3';
import chroma from 'chroma-js';

var staffColor = '#ffffff';
var colors = d3.scaleOrdinal()
  .domain(['U', 'L', 'D', 'R'])
  .range(['#e85151', '#f19b6f', '#53cf8d', '#6298e8']);
var dotSize = 5;
var perRow = 160;
var perColumn = 32;
var margin = {top: 20, left: 20};

// verify Flash in the Night, Do You Remember Me, Candy, Exotic Ethnic
class Visualization extends Component {
  componentDidMount() {
    this.container = d3.select(this.refs.container);

    var levels = _.chain(this.props.data.levels)
      .filter(level => level.mode === 'Single' || level.mode === 'Double')
      .sortBy(level => (level.mode === 'Single' ? '0' : '1') + level.difficulty[0])
      .value();
    this.renderStaff(levels);
    this.renderSteps(levels);
  }

  renderStaff(levels) {
    var totalGroups = _.chain(levels)
      .map(level => _.last(level.steps)[0]) // get very last count for each level
      .max().value();
    totalGroups = Math.ceil(totalGroups / perRow);
    var width = perRow * dotSize + 2 * margin.left;
    var height = 3 * (levels.length + 1) * dotSize * totalGroups + 2 * margin.top;
    this.container.attr('width', width)
      .attr('height', height);

    // rows should be the number of levels
    // column should be perRow divided by 32
    var rows = _.times(levels.length, i => i * 3 * dotSize);
    var columns = _.times(perRow / perColumn + 1, i => i * dotSize * perColumn);
    var staffs = _.times(totalGroups, i => i * 3 * (levels.length + 1) * dotSize);

    this.staffs = this.container.append('g')
      .attr('transform', 'translate(' + [margin.left, margin.top] + ')')
      .selectAll('.staff')
      .data(staffs).enter().append('g')
        .classed('staff', true)
        .attr('stroke', staffColor)
        .attr('opacity', 0.15)
        .attr('stroke-width', 0.5)
        .attr('transform', d => 'translate(' + [0, d] + ')');

    this.staffs.selectAll('.row')
      .data(rows).enter().append('line')
      .classed('row', true)
      .attr('x2', width - 2 * margin.left)
      .attr('y1', d => d)
      .attr('y2', d => d);

    this.staffs.selectAll('.column')
      .data(columns).enter().append('line')
      .classed('column', true)
      .attr('x1', d => d)
      .attr('x2', d => d)
      .attr('y2', 3 * (levels.length - 1) * dotSize);
  }

  renderSteps(levels) {

    this.levels = this.container.append('g')
      .attr('transform', 'translate(' + [margin.left, margin.top] + ')')
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
        var x = (d[0] % perRow + 1) * dotSize;
        var y = Math.floor(d[0] / perRow) * 3 * (levels.length + 1) * dotSize;

        return 'translate(' + [x, y] + ')';
      });

    this.steps.selectAll('circle')
      .data(d => {
        var steps = [];

        var i = 0;
        _.each(d[1], step => {
          if (step === '') return;

          steps.push({
            y: i * dotSize / 2,
            fill: colors(step),
          });
          i += 2;
        });
        _.each(d[2], step => {
          if (step === '') return;

          steps.push({
            y: i * dotSize / 2,
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
        <svg ref='container' />
      </div>
    );
  }
}

export default Visualization;
