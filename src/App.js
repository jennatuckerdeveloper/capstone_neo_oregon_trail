import React, { Component } from 'react'
import './App.css'
import PlayMenu from './PlayMenu'
import Naming from './Naming'
import Pack from './Pack'
import ItemPack from './ItemPack'
import DifficultyPage from './DifficultyPage'
import GameOver from './GameOver'

const DIFFICULTY = 'difficulty'
const NAMING = 'naming'
const PACKING = 'packing'
const ITEM = 'packItem'
const PLAYING = 'playing'
const GAMEOVER = 'gameover'
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
let gameMessage

const randomGenerator = function (lowest, highest) {
  const min = Math.ceil(lowest)
  const max = Math.floor(highest)
  return Math.floor(Math.random() * (max - min)) + min
}

const checkForSpecialCharacter = function (e) {
  return [RETURN, SPACEBAR].includes(e.keyCode)
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
    food: 800
  },
  3: {
    waterFilter: 4,
    solarPanel: 4,
    gps: 2,
    tent: 4,
    sleepingBag: 10,
    clothing: 10,
    food: 600
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
        days: 0,
        miles: 0
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
        name: 'Two',
        health: 100,
        status: ALIVE
      }, {
        name: 'Three',
        health: 100,
        status: ALIVE
      },
      {
        name: 'Four',
        health: 100,
        status: ALIVE
      },
      {
        name: 'Five',
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
    const milesGained = randomGenerator(12, 25)
    let newMiles = this.state.progress.miles
    newMiles += milesGained
    let newDays = this.state.progress.days
    newDays += 1
    const peopleList = this.state.people.map((person) => Object.assign({}, person))
    const peopleLiving = peopleList.filter((character) => character.status !== DEAD)
    let newPeopleList = this.peopleLoseHealth(peopleLiving)
    const foodPortions = peopleLiving.length
    const foodLost = randomGenerator(2 * foodPortions, 5 * foodPortions)
    let newFood = this.state.inventory.food
    if (this.state.inventory.food > 0) {
      newFood -= foodLost
    }
    if (newFood <= 0) {
      gameMessage = 'You have run out of food.'
      newFood = 'no food'
    }
    if (gameMessage.length === 0) {
      const badLuck = randomGenerator(1, 6) === 3
      newPeopleList = this.randomCharacterDeath(newPeopleList, badLuck)
    }
    this.setState({
      progress: {miles: newMiles, days: newDays},
      inventory: {food: newFood},
      people: newPeopleList
    })
  }

  peopleLoseHealth (peopleLiving) {
    const lostHealth = this.state.inventory.food > 0 ? 5 : 20
    const peopleList = peopleLiving.map(function (character) { character.health -= lostHealth; return character })
    const anyoneDead = peopleList.filter((person) => person.health <= 0)
    if (anyoneDead.length > 0) {
      const toChange = anyoneDead.pop()
      const personToChange = peopleList.indexOf(toChange)
      peopleList[personToChange].status = DEAD
      peopleList[personToChange].health = 0
      const deadPersonName = toChange.name
      const message = deadPersonName === 'You'
        ? `${deadPersonName} have died of starvation and exhaustion.`
        : `${deadPersonName} has died of starvation and exhaustion.`
      gameMessage = message
      if (deadPersonName === YOU) {
        this.setState({game: {gameState: GAMEOVER}})
      }
    }
    return peopleList
  }

  randomCharacterDeath (peopleList, badLuck) {
    if (badLuck === false) {
      return peopleList
    }
    const depressedCharacter = peopleList.find((person) => person.status === 'depressed')
    if (depressedCharacter === undefined) {
      const randomPersonName = peopleList[Math.floor(Math.random() * peopleList.length)].name
      const randomPersonObject = peopleList.find((person) => person.name === randomPersonName)
      const randomPersonPosition = peopleList.indexOf(randomPersonObject)
      peopleList[randomPersonPosition].status = 'depressed'
      const message = randomPersonName === 'You' ? `${randomPersonName} are depressed.` : `${randomPersonName} is depressed.`
      gameMessage = message
    } else {
      const luck = randomGenerator(1, 4)
      const depressedCharacterPosition = peopleList.indexOf(depressedCharacter)
      if (luck === 1) {
        peopleList[depressedCharacterPosition].status = ALIVE
      } else if (luck === 2) {
        peopleList[depressedCharacterPosition].status = DEAD
        const message = peopleList[depressedCharacterPosition].name === 'You'
          ? `${peopleList[depressedCharacterPosition].name} have died of melancholy.`
          : `${peopleList[depressedCharacterPosition].name} has died of melancholy.`
        gameMessage = message
      }
    }
    return peopleList
  }

  onUserPlay (e) {
    gameMessage = ''
    if (checkForSpecialCharacter(e)) {
      if (e.target.value === '1') {
        this.walk()
      }
    }
  }

  healthRepresentation (healthScore) {
    if (healthScore <= 100 && healthScore >= 80) {
      return GOOD
    } else if (healthScore < 80 && healthScore >= 60) {
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
    if (checkForSpecialCharacter(e) && e.target.value.toLowerCase() === Y) {
      const gameObject = Object.assign({}, this.state.game)
      gameObject['gameState'] = PACKING
      this.setState({game: gameObject})
    }
  }

  onPackingChoice (e) {
    const userChoice = parseInt(e.target.value, 10)
    if (checkForSpecialCharacter(e) && [1, 2, 3, 4, 5, 6, 7].includes(userChoice)) {
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

  itemChanging () {
    const inventoryObject = this.state.inventory
    for (let item in inventoryObject) {
      if (inventoryObject[item] === CHANGING) {
        return `How many ${itemRepresentation[packingMenu.indexOf(item)]} do you want to pack?`
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
    if (checkForSpecialCharacter(e)) {
      const userChoice = parseInt(e.target.value, 10)
      const changingInventory = this.state.inventory
      itemToChange = Object.keys(changingInventory).find((key, index, array) => changingInventory[key] === CHANGING)
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
      return `${number} ${item} added to your pack.`
    } else {
      return `You can only carry ${number} ${item}. ${number} + ${item} packed.`
    }
  }

  confirmPacking (e) {
    if (checkForSpecialCharacter(e) && e.target.value.toLowerCase() === Y) {
      const gameObject = Object.assign({}, this.state.game)
      gameObject['gameState'] = PLAYING
      this.setState({game: gameObject})
    }
  }

  handleDifficulty (e) {
    if (checkForSpecialCharacter(e)) {
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
          onConfirmNames={this.onConfirmNames}
        />
      )
    } else if (this.state.game.gameState === PACKING) {
      return (
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
          gameMessage={changeRepresentation}

        />
      )
    } else if (this.state.game.gameState === PLAYING) {
      return (
        <PlayMenu
          days={this.state.progress.days}
          miles={this.state.progress.miles}
          food={this.state.inventory.food}
          health={this.healthRepresentation(this.state.people[0].health)}
          onUserPlay={this.onUserPlay}
          gameMessage={gameMessage}
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
        <ItemPack
          itemChanging={this.itemChanging()}
          handleNumberToPack={this.handleNumberToPack}
        />
      )
    } else if (this.state.game.gameState === GAMEOVER) {
      return (
        <GameOver
          days={this.state.progress.days}
          miles={this.state.progress.miles}
          food={this.state.inventory.food}
          gameMessage={gameMessage}
        />
      )
    } else {
      return (
        <div>page changed</div>
      )
    }
  }
}

export default App
