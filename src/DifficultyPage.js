import React, { Component } from 'react'

export default class DifficultyPage extends Component {
  render () {
    return (
      <div id='difficulty'>
        <p>Many types of people take the trail.</p>
        <p>You may go as:</p>
        <p>1) a former computer programmer</p>
        <p>2) a retired army water-catchment engineer</p>
        <p>3) a displaced homesteader</p>
        <p>
          What is your choice?
          <input id='difficultyInput' type='text' onKeyDown={this.props.handleDifficulty} />
        </p>
      </div>
    )
  }
}
