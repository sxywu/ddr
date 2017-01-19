var fs = require('fs');
var _ = require('lodash');

var stepKeys = {
  1: 'D+L',
  2: 'D',
  3: 'D+R',
  4: 'L',
  6: 'R',
  8: 'U',
  7: 'U+L',
  9: 'U+R',
};
var songs = {};
var prevSteps = {};
var stepfiles = _.filter(fs.readdirSync('../stepfiles/stp'), d => _.includes(d, '.stp'));

// _.each(stepfiles, stepfile => {
  // if file has already been parsed, skip

  console.log('\n', '\n', stepfile);
  var stepfile = 'exotic.stp';
  var song = songs[stepfile] = {filename: stepfile, levels: []};
  var level;
  var beat = 8; // files default to 1/8 beat, but I want to remember it as 1/64
  var count = 4;

  var lines = fs.readFileSync('../stepfiles/stp/' + stepfile, 'utf-8');
  _.each(lines.split('\n'), line => {
    // get metadata
    var [key, val] = line.split(': ');
    if (key === 'Song') {
      song.name = val;
    } else if (key === 'Artist') {
      song.artist = val;
    } else if (key === 'BPM') {
      song.bpm = +val;
    } else if (key === 'Mode') {
      level = {mode: val, steps: []};
    } else if (key === 'Difficulty') {
      level.difficulty = val;
    } else if (key === '<<<') {
      // about to start a new set of steps
      song.levels.push(level);
      beat = 8;
      count = 4;
    } else if (key === '>>>') {
      // ends the set of steps
      // console.log('\n', level.mode, level.difficulty, '\n', JSON.stringify(level.steps))
    } else if (key === '{') {
      // doubles the beat (if it was at 1/8, it is now 1/16,
      // if at 1/16, it is now at 1/32, etc.)
      // so I need to divide variable beat
      beat /= 2;
    } else if (key === '}') {
      beat *= 2;
    } else if (!_.isNaN(+line)) {
      // if it's single, it should be a number
      if (+line) {
        var steps = _.map(line.split(''), num => 1 + stepKeys[num]);
        createSteps(count, steps, level.steps);
      }

      count += beat;
    } else if (_.every(line.split(':'), num => !_.isNaN(+num))) {
      // it's double
     var [left, right] = line.split(':');
     if (+left || +right) {
       // if one or either side has a step
       var steps1 = _.map(left.split(''), num => 1 + stepKeys[num]);
       var steps2 = _.map(right.split(''), num => 2 + stepKeys[num]);
       var steps = _.chain(steps1).union(steps2).filter().value();
       createSteps(count, steps, level.steps);
     }

     count += beat;
    }
  });

  fs.writeFileSync('songs.json', JSON.stringify(songs));
// });

// see if the step has been repeated the count before
// if yes, then update the end count of the step
// if not, create a new step and remember that.
// each step is [direction, start, end]
function createSteps(count, currentSteps, steps) {
  _.each(currentSteps, direction => {
    console.log(prevSteps)
    var prevStep = prevSteps[direction];

    // if the previous step is only 1 count less than current
    // then it must be a freeze, so just update that
    if (prevStep && count === prevStep[2] + 1) {
      prevStep[2] = count;
    } else {
      // else it must be a new step, so create and update prevSteps
      var step = [direction, count, count];
      steps.push(step);
      prevSteps[direction] = step;
    }
  });
  // _.each(currentSteps, sideStep => {
  //   var [side, step] = sideStep;
  //   var prevStep0 = prevSteps[0];
  //   var prevStep1 = prevSteps[1];
  //
  //   // first see if the step is the same direction as the 1st previous
  //   if (prevStep0 && step === prevStep0[0]) {
  //     // if it is, see if the prevCount is only 1 less than current
  //     if (count === prevStep0[2] + 1) {
  //       // if it is, merely update the end count to current
  //       prevStep0[2] = count;
  //     } else {
  //       // if it's not, then create a new step
  //       createStep(side + step, count, count);
  //     }
  //   } else if (prevStep1 && step === prevStep1[0]) {
  //     // if current step is the first, but it's the same as the 2nd previous
  //     if (count === prevStep1[2] + 1) {
  //       // and if it's a freeze arrow, then we have to see if
  //       // there's anything in first previous
  //       prevStep1[2] = count;
  //     } else {
  //       createStep(side + step, count, count);
  //     }
  //   }
  // });
}
