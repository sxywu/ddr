import React, { Component } from 'react';
import _ from 'lodash';

class Header extends Component {
  render() {
    var style = {
      maxWidth: 700,
      padding: 40,
      margin: 'auto',
    };

    return (
      <div className="Header" style={style}>
        <h1>DATA DRIVEN REVOLUTIONS</h1>
        <sup>
          BY <a href='http://twitter.com/sxywu' target='_new'>SHIRLEY WU</a>
        </sup>
        <p style={{lineHeight: 1.6}}>
I came across DDR in middle school, and was immediately intrigued.  It was the first time I had begged my parents for a video game, and the only time my parents bought me one.  I played all through high school with my friends and my little sister, and it is a part of some of my fondest memories.  So when I found <a href='http://www.ddrfreak.com/' target='_new'>DDR Freak</a> while looking for DDR data, I was beyond ecstatic; when I found their <a href='http://www.ddrfreak.com/stepcharts/stepcharts.php' target='_new'>step charts</a>, I knew I had to visualize them.
        </p>
        <p style={{lineHeight: 1.6}}>
At 250 songs, each with different modes (Single, Double, 6Panel, etc.) and difficulty levels (Basic, Trick, Maniac), thatʼs a lot of data; I had to be selective with what I showed.  Thus, each song only shows steps from Single mode, and only shows both arrows (jumps) when expanded.  Iʼve also compressed each song as much as possible, so that you can compare multiple songs at a time.  I hope that you find fascinating patterns, and if at first you donʼt, try filtering by a difficulty level.
        </p>
        <p style={{lineHeight: 1.6}}>
        <sup><em>Made with data from DDR Freak (thank you Jason!) and 💖 for December <a href='http://datasketch.es' target='_new'>data sketch|es</a>.</em></sup>
        </p>
      </div>
    );
  }
}

export default Header;
