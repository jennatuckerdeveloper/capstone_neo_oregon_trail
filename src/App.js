import React, { Component } from 'react'
import './App.css'
import PlayMenu from './PlayMenu'
import Naming from './Naming'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      game: {
        gameState: 'naming',
        difficulty: 1
      },
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
        status: 'alive'
      }, {
        name: '',
        health: 100,
        status: 'dead'
      }, {
        name: '',
        health: 100,
        status: 'alive'
      },
      {
        name: '',
        health: 100,
        status: 'alive'
      },
      {
        name: '',
        health: 100,
        status: 'alive'
      }
      ]}
    this.onUserPlay = this.onUserPlay.bind(this)
    this.handleName = this.handleName.bind(this)
    this.onConfirm = this.onConfirm.bind(this)
  }

  rangeGenerator (lowest, highest) {
    const min = Math.ceil(lowest)
    const max = Math.floor(highest)
    return Math.floor(Math.random() * (max - min)) + min
  }

  // This is causing an error message saying that I am directly mutating state.  Why?
  walk () {
    const milesGained = this.rangeGenerator(12, 25)
    let newMiles = this.state.progress.miles
    newMiles += milesGained
    let newDays = this.state.progress.days
    newDays += 1
    const peopleLiving = this.state.people.length - this.state.people.filter(function (character) { return character.status === 'dead' }).length
    const foodLost = this.rangeGenerator(2 * peopleLiving, 5 * peopleLiving)
    let newFood = this.state.inventory.food
    newFood -= foodLost
    this.setState({progress: {miles: newMiles, days: newDays}})
    this.setState({inventory: {food: newFood}})
    const lostHealth = this.state.inventory.food > 0 ? 5 : 20
    const newPeopleList = this.state.people.map(function (character) { character.health -= lostHealth; return character })
    this.setState({people: newPeopleList})
  }

  onUserPlay (e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
      if (e.target.value === '1') {
        this.walk()
      }
    }
  }

  healthRepresentation (healthScore) {
    if (healthScore <= 100 && healthScore >= 85) {
      return 'good'
    } else if (healthScore < 85 && healthScore >= 65) {
      return 'fair'
    } else {
      return 'poor'
    }
  }

  handleName (e) {
    const nameIndex = e.target.id.slice(0, 1)
    const name = e.target.value
    const peopleList = this.state.people.map((person) => Object.assign({}, person))
    peopleList[nameIndex]['name'] = name
    this.setState({people: peopleList})
  }

  onConfirm (e) {
    if (e.target.value === 'y') {
      this.setState({game: {gameState: 'playing'}})
    }
  }

  render () {
    if (this.state.game.gameState === 'naming') {
      return (
        <Naming
          handleName={this.handleName}
          onConfirm={this.onConfirm}
        />
      )
    } else if (this.state.game.gameState === 'playing') {
      return (
        <PlayMenu
          days={this.state.progress.days}
          miles={this.state.progress.miles}
          food={this.state.inventory.food}
          health={this.healthRepresentation(this.state.people[1].health)}
          onUserPlay={this.onUserPlay}
        />
      )
    } else if (this.state.game.gameState === 'packing') {
      return (
        <div> ready to make packing page </div>
      )
    }
  }
}

export default App
