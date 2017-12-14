import React, { Component } from 'react'

export default class GameOver extends Component {
  render () {
    return (
      <div className='GAMEOVER'>
        <div id='gameStatus' >
          <p>Days on the trail: {this.props.days}</p>
          <p>Miles: {this.props.miles}</p>
          <p>Food: {this.props.food}</p>
          <p id='health'>Health: deceased</p>
        </div>
        <div id='gameMessage'>{this.props.gameMessage}</div>
        <div id='gameOver' >
          <p>Game Over</p>
        </div>
      </div>
    )
  }
}
