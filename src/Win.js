import React, { Component } from 'react'

export default class Win extends Component {
  render () {
    return (
      <div className='win'>
        <div id='gameStatus' >
          <p>Days on the trail: {this.props.days}</p>
          <p>Miles: {this.props.miles}</p>
          <p>Food: {this.props.food}</p>
          <p id='health'>Health: {this.props.health}</p>
        </div>
        <div id='gameMessage'>You have reached the Cascades!</div>
        <div id='gameOver' >
          <p>You Win!</p>
          <p>See who has walked the trail. <input type='text' onKeyDown={this.props.onFinish} /> </p>
        </div>
      </div>
    )
  }
}
