import React, { Component } from 'react'

export default class Naming extends Component {
  render () {
    return (
      <div className='Naming' >
          You will lead your team on the trail.
        <br />
          What are the first names of the other four in your party?
        <br />
          2. <input className='people' id='1teamMember' type='text' onChange={this.props.handleName} />
        <br />
          3. <input className='people' id='2teamMember' type='text' onChange={this.props.handleName} />
        <br />
          4. <input className='people' id='3teamMember' type='text' onChange={this.props.handleName} />
        <br />
          5. <input className='people' id='4teamMember' type='text' onChange={this.props.handleName} />
        <br />
          Are these names correct?
        <input id='confirmNames' type='text' maxLength='1' onKeyDown={this.props.onConfirm} />
      </div>
    )
  }
}
