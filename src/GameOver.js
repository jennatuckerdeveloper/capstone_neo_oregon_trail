import React, { Component } from 'react'

export default class GameOver extends Component {
  render () {
    return (
      <div className='GAMEOVER'>
        <div id='gameStatus' >
          <p id='dayCount'>Days on the trail: {this.props.days}</p>
          <p id='mileCount'>Miles: {this.props.miles}</p>
          <p id='foodCount'>Food: {this.props.food}</p>
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
