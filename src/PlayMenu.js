import React, { Component } from 'react'

export default class PlayMenu extends Component {
  render () {
    return (
      <div className='PlayMenu'>
        <div id='gameStatus' >
          Days on the trail: {this.props.days}
          <br />
          Miles: {this.props.miles}
          <br />
          Food: {this.props.food}
          <br />
          <div id='health'>
          Health: {this.props.health}
          </div>
        </div>
        <div id='gameMessage'> x </div>
        <div id='gameMenu' >
          What do you want to do?
          <br />
          1. Walk on.
          <br />
          <input type='text' id='play' maxLength='1' onKeyDown={this.props.onUserPlay} />
        </div>
      </div>
    )
  }
}
