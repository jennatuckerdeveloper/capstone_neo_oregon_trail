import React, { Component } from 'react'

export default class Naming extends Component {
  render () {
    return (
      <div className='Naming' >
        <p>You will lead your team on the trail.</p>
        <p>What are the first names of the other four in your party?</p>
        <p>2. <input className='people' id='1teamMember' type='text' onChange={this.props.handleName} /></p>
        <p>3. <input className='people' id='2teamMember' type='text' onChange={this.props.handleName} /></p>
        <p>4. <input className='people' id='3teamMember' type='text' onChange={this.props.handleName} /></p>
        <p>5. <input className='people' id='4teamMember' type='text' onChange={this.props.handleName} /></p>
        <p>Are these names correct?</p>
        <p><input id='confirmNames' type='text' maxLength='1' onKeyDown={this.props.onConfirm} /></p>
      </div>
    )
  }
}
