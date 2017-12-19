import React, { Component } from 'react'

export default class Finish extends Component {
  render () {
    return (
      <div className='Finish'>
        <div>
          <p>The National Parks Service has turned the walls of a central Ranger
          Station into a monument to those who have taken the trail.</p>
          <p>
            Please enter your name if you want your team remembered on this monument.
            <input type='text' id='signWall' onKeyDown={this.props.signWall} />
          </p>
          <p>Otherwise, press leave blank and press SPACEBAR or ENTER</p>
        </div>
      </div>
    )
  }
}
