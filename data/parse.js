var fs = require('fs');
var _ = require('lodash');

var stepKeys = {
  2: 'U',
  4: 'L',
  6: 'R',
  8: 'D',
  7: 7,
  9: 9,
};
var stepfiles = _.filter(fs.readdirSync('../stepfiles/stp'), d => _.includes(d, '.stp'));
var stepfile = stepfiles[0];

var songs = {};

var song = songs[stepfile] = {filename: stepfile, levels: []};
var level;
var beat = 8; // files default to 1/8 beat, but I want to remember it as 1/64
var count = 0;
fs.createReadStream('../stepfiles/stp/' + stepfile, 'utf-8')
  .on('data', d => {
    _.each(d.split('\n'), line => {
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
        count = 0;
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
          level.steps.push([
            count,
            _.map(line, num => stepKeys[num]),
          ]);
        }

        count += beat;
      } else if (_.every(line.split(':'), num => !_.isNaN(+num))) {
        // it's double
       var [left, right] = line.split(':');
       if (+left || +right) {
         // if one or either side has a step
         level.steps.push([
           count,
           _.map(left, num => stepKeys[num] || ''),
           _.map(right, num => stepKeys[num] || ''),
         ])
       }

       count += beat;
     } else {
       console.log(song.name, line);
     }
    });
  }).on('close', () => {
    fs.writeFileSync('songs.json', JSON.stringify(songs));
  });
