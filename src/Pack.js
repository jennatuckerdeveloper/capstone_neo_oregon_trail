import React, { Component } from 'react'

export default class Pack extends Component {
  render () {
    return (
      <div id='packing'>
        <p>Your team will travel with two pack mules.</p>
        <p>You must decide what to pack for your journey.</p>
        <p>Your web research recommends the following:</p>
        <p><span className='packItem'> 1. Water filters</span><span className='packed'>{this.props.waterFilter} packed</span></p>
        <p><span className='packItem'> 2. Portable solar panels</span><span className='packed'>{this.props.solarPanel} packed</span></p>
        <p><span className='packItem'> 3. A GPS</span><span className='packed'>{this.props.gps} packed</span></p>
        <p><span className='packItem'> 4. Tents</span><span className='packed'>{this.props.tent} packed</span></p>
        <p><span className='packItem'> 5. Sleeping bags</span><span className='packed'>{this.props.sleepingBag} packed</span></p>
        <p><span className='packItem'> 6. Clothing and boots</span><span className='packed'>{this.props.clothing} packed</span></p>
        <p><span className='packItem'> 7. Food</span><span className='packed'>{this.props.food} pounds packed</span></p>
        <p>What do you want to pack?  <input id='packingInput' onKeyDown={this.props.onPackingChoice} maxLength='1' /></p>
        <p>Finished packing? <input id='finishedPacking' onKeyDown={this.props.confirmPacking} maxLength='1' /></p>
        <p id='packMessage'>{this.props.gameMessage}</p>
      </div>
    )
  }
}
