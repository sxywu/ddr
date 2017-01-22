import React, { Component } from 'react';
import _ from 'lodash';

class Header extends Component {
  render() {
    var style = {
      width: 800,
      padding: 40,
      margin: 'auto',
    };

    var size = 20;
    var arrows = _.map(['U', 'D', 'L', 'R'], direction => {
      var arrowStyle = {
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: 'rgb(' + this.props.colors(direction) + ')',
        color: '#fff',
        fontWeight: 600,
        fontSize: size * 0.75,
        verticalAlign: 'top',
        padding: 5,
        margin: 5,
        cursor: 'pointer',
      };
      return (<span className='header' style={arrowStyle}>{direction}</span>);
    });

    return (
      <div className="Header" style={style}>
        <h4><a href='http://twitter.com/sxywu' target='_new'>SHIRLEY WU</a></h4>
        <div>
          {arrows}
        </div>
      </div>
    );
  }
}

export default Header;
