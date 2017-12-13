import React, { Component } from 'react'

export default class ItemPack extends Component {
  render () {
    return (
      <div id='itemPack'>
        <p>{this.props.itemChanging}<input id='numberToPack' onKeyDown={this.props.handleNumberToPack} /></p>
      </div>
    )
  }
}
