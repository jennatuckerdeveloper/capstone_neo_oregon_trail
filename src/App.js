import React, { Component } from 'react'
import './App.css'
import PlayMenu from './PlayMenu'
import Naming from './Naming'
import Pack from './Pack'
import ItemPack from './ItemPack'
import DifficultyPage from './DifficultyPage'
import GameOver from './GameOver'
import Win from './Win'

// write tests for random character death
// can I import the function and test it? or do I have a testing problem because it's random?

const DIFFICULTY = 'difficulty'
const NAMING = 'naming'
const PACKING = 'packing'
const ITEM = 'packItem'
const PLAYING = 'playing'
const GAMEOVER = 'gameover'
const WIN = 'win'
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
const TRAIL_MILES = 1000

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
    // walk is the only thing that will set state
    let forSetState
    const milesGained = randomGenerator(12, 25)
    const newProgress = Object.assign({}, this.state.progress)
    newProgress['miles'] += milesGained
    newProgress['days'] += 1
    if (newProgress['miles'] > TRAIL_MILES) {
      forSetState = this.finishGame(newProgress)
    } else {
      forSetState = this.continueGame(newProgress)
    }
    this.setState(forSetState)
  }

  finishGame (progress) {
    const gameStateObject = Object.assign({}, this.state.game)
    gameStateObject['gameState'] = WIN
    const progressObject = Object.assign({}, this.state.progress)
    return {
      game: gameStateObject,
      progress: progressObject
    }
  }

  continueGame (progressObj) {
    const peopleList = this.state.people.map((person) => Object.assign({}, person))
    const peopleLiving = peopleList.filter((character) => character.status !== DEAD)
    let lessHealthPeopleList = this.peopleLoseHealth(peopleLiving)
    let deadenedCharacterList = this.handleCharacterDeath(lessHealthPeopleList)

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
      const luck = randomGenerator(1, 4)
      deadenedCharacterList = this.randomCharacterDeath(deadenedCharacterList, badLuck, luck)
    }

    const youIsDead = this.isYouDead(deadenedCharacterList)
    const gameObj = {
      gameState: youIsDead ? GAMEOVER : PLAYING,
      difficulty: this.state.game.difficulty
    }

    return {
      game: gameObj,
      progress: progressObj,
      inventory: {food: newFood},
      people: deadenedCharacterList
    }
  }

  peopleLoseHealth (peopleLiving) {
    const lostHealth = this.state.inventory.food > 0 ? 0 : 20 // correct 0 to 5
    const peopleList = peopleLiving.map(function (character) { character.health -= lostHealth; return character })
    return peopleList
  }

  isYouDead (deadenedCharacterList) {
    const newCharacterList = deadenedCharacterList.map((person) => Object.assign({}, person))
    const you = newCharacterList.find((person) => person.name === YOU)
    return you.status === DEAD
  }

  handleCharacterDeath (peopleList) {
    let newList = peopleList.map((person) => Object.assign({}, person))
    const anyoneDead = newList.filter((person) => person.health <= 0)
    if (anyoneDead.length > 0) {
      const toChange = anyoneDead.pop()
      const personToChange = newList.indexOf(toChange) // also for message
      newList[personToChange].status = DEAD
      newList[personToChange].health = 0
      // to generate message, will change
      const deadPersonName = toChange.name
      const message = deadPersonName === 'You'
        ? `${deadPersonName} have died of starvation and exhaustion.`
        : `${deadPersonName} has died of starvation and exhaustion.`
      gameMessage = message
    }
    return newList
  }

  randomCharacterDeath (peopleList, badLuck, luck) {
    if (badLuck === false) {
      return peopleList
    }
    let newPeopleList = peopleList.map((person) => Object.assign({}, person))
    const depressedCharacter = newPeopleList.find((person) => person.status === 'depressed')
    if (depressedCharacter === undefined) {
      const randomPersonName = newPeopleList[Math.floor(Math.random() * newPeopleList.length)].name
      const randomPersonObject = newPeopleList.find((person) => person.name === randomPersonName)
      const randomPersonPosition = newPeopleList.indexOf(randomPersonObject)
      newPeopleList[randomPersonPosition].status = 'depressed'
      const message = randomPersonName === 'You' ? `${randomPersonName} are depressed.` : `${randomPersonName} is depressed.`
      gameMessage = message
    } else {
      const depressedCharacterPosition = newPeopleList.indexOf(depressedCharacter)
      if (luck === 1) {
        newPeopleList[depressedCharacterPosition].status = ALIVE
      } else if (luck === 2) {
        newPeopleList[depressedCharacterPosition].status = DEAD
        const message = newPeopleList[depressedCharacterPosition].name === 'You'
          ? `${newPeopleList[depressedCharacterPosition].name} have died of melancholy.`
          : `${newPeopleList[depressedCharacterPosition].name} has died of melancholy.`
        gameMessage = message
      }
    }
    return newPeopleList
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
        <Win
          days={this.state.progress.days}
          miles={this.state.progress.miles}
          food={this.state.inventory.food}
          health={this.healthRepresentation(this.state.people[0].health)}
        />
      )
    }
  }
}

export default App
