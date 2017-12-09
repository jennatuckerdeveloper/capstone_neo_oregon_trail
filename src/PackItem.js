import React, { Component } from 'react'

export default class PackItem extends Component {
  render () {
    return (
      <div id='packItem'>
        <p>{this.props.itemKey}</p>

      </div>
    )
  }
}
