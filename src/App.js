import React, { Component } from 'react'
import './App.css'
import PlayMenu from './PlayMenu'
import Naming from './Naming'

const NAMING = 'naming'
const PLAYING = 'playing'
const PACKING = 'packing'
const YOU = 'You'
const DEAD = 'dead'
const ALIVE = 'alive'
const RETURN = 13
const SPACEBAR = 32
const GOOD = 'good'
const FAIR = 'fair'
const POOR = 'poor'
const Y = 'y'

const rangeGenerator = function (lowest, highest) {
  const min = Math.ceil(lowest)
  const max = Math.floor(highest)
  return Math.floor(Math.random() * (max - min)) + min
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      game: {
        gameState: NAMING,
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
        name: YOU,
        health: 100,
        status: ALIVE
      }, {
        name: '',
        health: 100,
        status: DEAD
      }, {
        name: '',
        health: 100,
        status: ALIVE
      },
      {
        name: '',
        health: 100,
        status: ALIVE
      },
      {
        name: '',
        health: 100,
        status: ALIVE
      }
      ]}
    this.onUserPlay = this.onUserPlay.bind(this)
    this.handleName = this.handleName.bind(this)
    this.onConfirm = this.onConfirm.bind(this)
  }

  walk () {
    const milesGained = rangeGenerator(12, 25)
    let newMiles = this.state.progress.miles
    newMiles += milesGained
    let newDays = this.state.progress.days
    newDays += 1
    const peopleList = this.state.people
    const peopleLiving = peopleList.filter((character) => character.status !== DEAD).length
    const foodLost = rangeGenerator(2 * peopleLiving, 5 * peopleLiving)
    let newFood = this.state.inventory.food
    newFood -= foodLost
    const lostHealth = this.state.inventory.food > 0 ? 5 : 20
    const newPeopleList = this.state.people.map(function (character) { character.health -= lostHealth; return character })
    this.setState({
      progress: {miles: newMiles, days: newDays},
      inventory: {food: newFood},
      people: newPeopleList
    })
  }

  onUserPlay (e) {
    if (e.keyCode === RETURN || e.keyCode === SPACEBAR) {
      if (e.target.value === '1') {
        console.log('currentState', this.state)
        this.walk()
      }
    }
  }

  healthRepresentation (healthScore) {
    if (healthScore <= 100 && healthScore >= 85) {
      return GOOD
    } else if (healthScore < 85 && healthScore >= 65) {
      return FAIR
    } else {
      return POOR
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
    if (e.target.value.toLowerCase() === Y) {
      this.setState({game: {gameState: PLAYING}})
    }
  }

  render () {
    if (this.state.game.gameState === NAMING) {
      return (
        <Naming
          handleName={this.handleName}
          onConfirm={this.onConfirm}
        />
      )
    } else if (this.state.game.gameState === PLAYING) {
      return (
        <PlayMenu
          days={this.state.progress.days}
          miles={this.state.progress.miles}
          food={this.state.inventory.food}
          health={this.healthRepresentation(100)}
          onUserPlay={this.onUserPlay}
        />
      )
    } else if (this.state.game.gameState === PACKING) {
      return (
        <div> ready to make packing page </div>
      )
    }
  }
}

export default App
