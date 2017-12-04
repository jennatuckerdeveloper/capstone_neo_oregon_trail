import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      progress: {
        days: 12,
        miles: 123
      },
      inventory: {
        waterFilter: 12,
        sleepingBags: 3,
        food: 200
      },
      people: [{
        name: 'You',
        health: 100,
        status: null
      }, {
        name: 'Jim',
        health: 100,
        status: null
      }, {
        name: 'Sallie',
        health: 100,
        status: null
      }
      ]}
    this.onUserPlay = this.onUserPlay.bind(this)
  }

  rangeGenerator (lowest, highest) {
    const min = Math.ceil(lowest)
    const max = Math.floor(highest)
    return Math.floor(Math.random() * (max - min)) + min
  }

  walk () {
    const milesGained = this.rangeGenerator(12, 25)
    const foodLost = this.rangeGenerator(10, 20)
    const newMiles = this.state.progress.miles += milesGained
    const newDays = this.state.progress.days += 1
    const newFood = this.state.inventory.food -= foodLost
    this.setState({progress: {miles: newMiles, days: newDays}})
    this.setState({inventory: {food: newFood}})
  }

  onUserPlay (e) {
    if (e.keyCode === 13) {
      if (e.target.value === '1') {
        this.walk()
      }
    }
  }

  render () {
    return (
      <div className='App'>
        <div id='gameStatus' >
          Days on the trail: {this.state.progress.days}
          <br />
          Miles: {this.state.progress.miles}
          <br />
          Food: {this.state.inventory.food}
          <br />
          Health: {this.state.people[1].health}
        </div>
        <div id='gameMessage'> x </div>
        <div id='gameMenu' >
          What do you want to do?
          <br />
          1. Walk on.
          <br />
          <input type='text' id='play' maxLength='1' onKeyDown={this.onUserPlay} />
        </div>
      </div>
    )
  }
}

export default App
