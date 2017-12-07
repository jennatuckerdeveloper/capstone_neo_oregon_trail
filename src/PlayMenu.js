import React, { Component } from 'react'

export default class PlayMenu extends Component {
  render () {
    return (
      <div className='PlayMenu'>
        <div id='gameStatus' >
          <p>Days on the trail: {this.props.days}</p>
          <p>Miles: {this.props.miles}</p>
          <p>Food: {this.props.food}</p>
          <p id='health'>Health: {this.props.health}</p>
        </div>
        <div id='gameMessage'> x </div>
        <div id='gameMenu' >
          <p>What do you want to do?</p>
          <p>1. Walk on.</p>
          <input type='text' id='play' maxLength='1' onKeyDown={this.props.onUserPlay} />
        </div>
      </div>
    )
  }
}
