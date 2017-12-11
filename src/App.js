import React, { Component } from 'react'
import './App.css'
import PlayMenu from './PlayMenu'
import Naming from './Naming'
import Pack from './Pack'
import DifficultyPage from './DifficultyPage'

const DIFFICULTY = 'difficulty'
const PACKING = 'packing'
const ITEM = 'packItem'
const NAMING = 'naming'
const PLAYING = 'playing'
const CHANGING = 'changing'
const YOU = 'You'
const DEAD = 'dead'
const ALIVE = 'alive'
const RETURN = 13
const SPACEBAR = 32
const GOOD = 'good'
const FAIR = 'fair'
const POOR = 'poor'
const Y = 'y'

let changeRepresentation

const rangeGenerator = function (lowest, highest) {
  const min = Math.ceil(lowest)
  const max = Math.floor(highest)
  return Math.floor(Math.random() * (max - min)) + min
}

const packingMenu = ['waterFilter', 'solarPanel', 'gps', 'tent', 'sleepingBag', 'clothing', 'food']

const itemRepresentation = [
  'water filters',
  'solar panels',
  'gps devices',
  'tents',
  'sleeping bags',
  'sets of clothes',
  'pounds of food'
]

const difficultyLevels = {
  1: {
    waterFilter: 4,
    solarPanel: 4,
    gps: 2,
    tent: 4,
    sleepingBag: 10,
    clothing: 10,
    food: 1000
  },
  2: {
    waterFilter: 4,
    solarPanel: 4,
    gps: 2,
    tent: 4,
    sleepingBag: 10,
    clothing: 10,
    food: 1000
  },
  3: {
    waterFilter: 4,
    solarPanel: 4,
    gps: 2,
    tent: 4,
    sleepingBag: 10,
    clothing: 10,
    food: 1000
  }
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      game: {
        gameState: DIFFICULTY,
        difficulty: 'notSet'
      },
      progress: {
        days: 12,
        miles: 123
      },
      inventory: {
        waterFilter: 0,
        solarPanel: 0,
        gps: 0,
        tent: 0,
        sleepingBag: 0,
        clothing: 0,
        food: 0
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
    this.onConfirmNames = this.onConfirmNames.bind(this)
    this.handleDifficulty = this.handleDifficulty.bind(this)
    this.onPackingChoice = this.onPackingChoice.bind(this)
    this.confirmPacking = this.confirmPacking.bind(this)
    this.handleNumberToPack = this.handleNumberToPack.bind(this)
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

  onConfirmNames (e) {
    if (e.target.value.toLowerCase() === Y) {
      const gameObject = Object.assign({}, this.state.game)
      gameObject['gameState'] = PACKING
      this.setState({game: gameObject})
    }
  }

  onPackingChoice (e) {
    const userChoice = parseInt(e.target.value, 10)
    if ((e.keyCode === RETURN || e.keyCode === SPACEBAR) && [1, 2, 3, 4, 5, 6, 7].includes(userChoice)) {
      const gameObject = Object.assign({}, this.state.game)
      gameObject['gameState'] = ITEM
      const inventoryChange = Object.assign({}, this.state.inventory)
      const itemInventoryKey = packingMenu[userChoice - 1]
      inventoryChange[itemInventoryKey] = CHANGING
      this.setState({
        game: gameObject,
        inventory: inventoryChange
      })
    }
  }

  itemChanging (inventoryObject) {
    for (let item in inventoryObject) {
      if (inventoryObject[item] === CHANGING) {
        return 'How many ' + itemRepresentation[packingMenu.indexOf(item)] + ' do you want to pack?'
      }
    }
  }

  limitPacking (inventoryItem) {
    const difficultyLevel = this.state.game.difficulty
    const itemLimit = difficultyLevels[difficultyLevel][inventoryItem]
    return itemLimit
  }

  handleNumberToPack (e) {
    let itemToChange
    let message
    if (e.keyCode === RETURN || e.keyCode === SPACEBAR) {
      const userChoice = parseInt(e.target.value, 10)
      const changingInventory = this.state.inventory
      for (let item in changingInventory) {
        if (changingInventory[item] === CHANGING) {
          itemToChange = item
        }
      }
      const itemLimit = this.limitPacking(itemToChange)
      const changeToMake = itemLimit < userChoice ? itemLimit : userChoice
      const userSuccess = itemLimit >= userChoice
      message = this.packChangeRepresentation(userSuccess, changeToMake, itemToChange)
      changeRepresentation = message
      changingInventory[itemToChange] = changeToMake
      const pageChange = Object.assign({}, this.state.game)
      pageChange['gameState'] = PACKING
      this.setState({
        game: pageChange,
        inventory: changingInventory})
    }
  }
  packChangeRepresentation (userSuccess, number, item) {
    item = itemRepresentation[packingMenu.indexOf(item)]
    if (userSuccess) {
      return number + ' ' + item + ' added to your pack.'
    } else {
      return 'You can only carry ' + number + ' ' + item + '. ' + number + ' ' + item + ' packed.'
    }
  }

  confirmPacking (e) {
    if (e.keyCode === RETURN || e.keyCode === SPACEBAR) {
      const gameObject = Object.assign({}, this.state.game)
      gameObject['gameState'] = PLAYING
      this.setState({game: gameObject})
    }
  }

  handleDifficulty (e) {
    if (e.keyCode === RETURN || e.keyCode === SPACEBAR) {
      const userChoice = parseInt(e.target.value, 10)
      if ([1, 2, 3].includes(userChoice)) {
        const gameObject = Object.assign({}, this.state.game)
        gameObject['difficulty'] = userChoice
        gameObject['gameState'] = NAMING
        this.setState({
          game: gameObject
        })
      }
    }
  }

  render () {
    if (this.state.game.gameState === NAMING) {
      return (
        <Naming
          handleName={this.handleName}
          onConfirm={this.onConfirmNames}
        />
      )
    } else if (this.state.game.gameState === PACKING) {
      return (
        <div>
          <Pack
            waterFilter={this.state.inventory.waterFilter}
            solarPanel={this.state.inventory.solarPanel}
            gps={this.state.inventory.gps}
            tent={this.state.inventory.tent}
            sleepingBag={this.state.inventory.sleepingBag}
            clothing={this.state.inventory.clothing}
            food={this.state.inventory.food}
            onPackingChoice={this.onPackingChoice}
            confirmPacking={this.confirmPacking}

          />
          <p id='packMessage'>{changeRepresentation}</p>
        </div>
      )
    } else if (this.state.game.gameState === PLAYING) {
      return (
        <PlayMenu
          days={this.state.progress.days}
          miles={this.state.progress.miles}
          food={this.state.inventory.food}
          health={this.healthRepresentation(this.state.people[0])}
          onUserPlay={this.onUserPlay}
        />
      )
    } else if (this.state.game.gameState === DIFFICULTY) {
      return (
        <DifficultyPage
          handleDifficulty={this.handleDifficulty}
        />
      )
    } else if (this.state.game.gameState === ITEM) {
      return (
        <div id='itemPack'>
          <p>{this.itemChanging(this.state.inventory)}<input id='numberToPack' onKeyDown={this.handleNumberToPack} /></p>
        </div>
      )
    } else {
      return (
        <div>page changed</div>
      )
    }
  }
}

export default App
