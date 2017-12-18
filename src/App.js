import React, { Component } from 'react'
import './App.css'
import PlayMenu from './PlayMenu'
import Naming from './Naming'
import Pack from './Pack'
import ItemPack from './ItemPack'
import DifficultyPage from './DifficultyPage'
import GameOver from './GameOver'
import Win from './Win'
import Wall from './Wall'

const fetch = require('node-fetch')

// i have an asynchronicity problem --> the user signs, but their brick does not show up until they reload the page
/*
the fetch call happens before the component mounts
the setState is called then
the fetch and call need to be done again when a component loads
*/

const DIFFICULTY = 'difficulty'
const NAMING = 'naming'
const PACKING = 'packing'
const ITEM = 'packItem'
const PLAYING = 'playing'
const GAMEOVER = 'gameover'
const WIN = 'win'
const FINISH = 'finish'
const CHANGING = 'changing'
const WALL = 'wall'
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
        gameState: FINISH,
        difficulty: 'notSet',
        gameMessage: ''
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
        food: 1
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
      ],
      data: []
    }
    this.onUserPlay = this.onUserPlay.bind(this)
    this.handleName = this.handleName.bind(this)
    this.onConfirmNames = this.onConfirmNames.bind(this)
    this.handleDifficulty = this.handleDifficulty.bind(this)
    this.onPackingChoice = this.onPackingChoice.bind(this)
    this.confirmPacking = this.confirmPacking.bind(this)
    this.handleNumberToPack = this.handleNumberToPack.bind(this)
    this.onFinish = this.onFinish.bind(this)
    this.signWall = this.signWall.bind(this)
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
    let newGameMessage = ''
    const peopleLiving = this.ignoreStatusDead(this.state.people) // removes all dead characters from play
    let lessHealthPeopleList = this.peopleLoseHealth(peopleLiving) // decrements all charaters' health, higher decrement if no food
    let newCharacterList = this.statusDeadChange(lessHealthPeopleList) // changes stauts of one character with health below 0 to "dead"
    newGameMessage = this.starvedCharacterMessage(newCharacterList) // returns message or empty string
    let noMessage = newGameMessage.length < 1
    const newFood = this.decrementFood(newCharacterList)
    if (this.state.inventory.food > 0 && newFood.food <= 0) { // creates game message when player runs out of food
      newGameMessage = 'You have run out of food.'
    }
    if (noMessage) {
      const badLuck = randomGenerator(1, 6) === 3
      const luck = randomGenerator(1, 4)
      newCharacterList = this.randomCharacterDeath(newCharacterList, badLuck, luck) // returns character list with a depresed or dead character
      const newlyDepressed = newCharacterList.filter((person) => person.status === 'depressed').filter((person) => person in this.state.people)
      const newlyDead = newCharacterList.filter((person) => person.status === 'dead').filter((person) => person in this.state.people)
      const anyNewDepressed = newlyDepressed.length > 0
      const anyNewlyDead = newlyDead > 0
      if (anyNewDepressed) {
        const newlyDepressedName = newlyDepressed.name
        newGameMessage = newlyDepressedName === 'You' ? `${newlyDepressedName} are depressed.` : `${newlyDepressedName} is depressed.`
      }
      if (anyNewlyDead) {
        const newlyDeadName = newlyDead.name
        newGameMessage = newlyDeadName === 'You'
          ? `${newlyDeadName} have died of melancholy.`
          : `${newlyDeadName} has died of melancholy.`
      }
    }
    const youIsDead = this.isYouDead(newCharacterList) // bool
    const newGameObj = { // gameObj changed for 'You' dead, ends game
      gameState: youIsDead ? GAMEOVER : PLAYING, // continues or ends game depending on if 'You' in new people list is dead
      difficulty: this.state.game.difficulty, // preserves difficulty
      gameMessage: newGameMessage // new game message
    }

    return {
      game: newGameObj,
      progress: progressObj,
      inventory: newFood,
      people: newCharacterList
    }
  }

  starvedCharacterMessage (characterList) {
    const deadThisPlay = characterList.filter((person) => person.status === 'dead')
    if (deadThisPlay.length > 0) {
      const deadPersonName = deadThisPlay[0].name
      const message = deadPersonName === 'You'
        ? `${deadPersonName} have died of starvation and exhaustion.`
        : `${deadPersonName} has died of starvation and exhaustion.`
      const newGameMessage = message
      return newGameMessage
    } else {
      return ''
    }
  }

  ignoreStatusDead () {
    const peopleList = this.state.people.map((person) => Object.assign({}, person))
    const peopleLiving = peopleList.filter((character) => character.status !== DEAD)
    return peopleLiving
  }

  peopleLoseHealth (peopleLiving) {
    const lostHealth = this.state.inventory.food > 0 ? 5 : 20 // correct 0 to 5
    const peopleList = peopleLiving.map(function (character) { character.health -= lostHealth; return character })
    return peopleList
  }

  decrementFood (newCharacterList) {
    const inventoryObject = Object.assign({}, this.state.inventory)
    const foodPortions = newCharacterList.length // number of people living and eating
    const foodLost = randomGenerator(2 * foodPortions, 5 * foodPortions) // pounds eaten
    let newFood // pounds of food
    if (this.state.inventory.food > 0) {
      newFood = inventoryObject.food - foodLost
      if (newFood < 0) {
        inventoryObject['food'] = 0
      } else {
        inventoryObject['food'] = newFood
      }
    } else if (newFood <= 0) {
      newFood = 0
      inventoryObject['food'] = newFood
    }
    return inventoryObject
  }

  isYouDead (deadenedCharacterList) {
    const newCharacterList = deadenedCharacterList.map((person) => Object.assign({}, person))
    const you = newCharacterList.find((person) => person.name === YOU)
    return you.status === DEAD
  }

  statusDeadChange (peopleList) {
    // changes one character's status to 'dead' when any number of characters health below 0
    let newList = peopleList.map((person) => Object.assign({}, person))
    const anyoneDead = newList.filter((person) => person.health <= 0)
    if (anyoneDead.length > 0) {
      const toChange = anyoneDead.pop()
      const personToChange = newList.indexOf(toChange)
      newList[personToChange].status = DEAD
      newList[personToChange].health = 0
      return newList
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
    } else {
      const depressedCharacterPosition = newPeopleList.indexOf(depressedCharacter)
      if (luck === 1) {
        newPeopleList[depressedCharacterPosition].status = ALIVE
      } else if (luck === 2) {
        newPeopleList[depressedCharacterPosition].status = DEAD
      }
    }
    return newPeopleList
  }

  onUserPlay (e) {
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
      changingInventory[itemToChange] = changeToMake
      const newGameObj = Object.assign({}, this.state.game)
      newGameObj['gameState'] = PACKING
      newGameObj['gameMessage'] = message
      this.setState({
        game: newGameObj,
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
      gameObject['gameMessage'] = ''
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

  onFinish (e) {
    const newGameObject = Object.assign({}, this.state.game)
    newGameObject['gameState'] = FINISH
    this.setState({game: newGameObject})
  }

  signWall (e) {
    if (checkForSpecialCharacter(e)) {
      const userEntry = e.target.value
      if (userEntry !== '') {
        const playerName = e.target.value
        const allCharacters = this.state.people.map((person) => Object.assign(person))
        const deadCharacters = allCharacters.filter((person) => person.status === DEAD)
        const aliveCharacters = allCharacters.filter((person) => person.status === ALIVE || person.status === 'depressed')
        const lost = deadCharacters.map((person) => person.name)
        const survived = aliveCharacters.map((person) => person.name)
        const youIndex = survived.indexOf(YOU)
        survived[youIndex] = playerName
        const pkg = {
          method: 'POST',
          body: JSON.stringify({
            survived: survived,
            lost: lost
          })
        }
        fetch('https://neo-oregon-trail.firebaseio.com/wall.json', pkg)
          .then(
            /* eslint-disable no-console */
            fetch('https://neo-oregon-trail.firebaseio.com/wall.json')
              .then((response) => response.json())
              .then((allData) => {
                const orderedData = Object.entries(allData).reverse()
                this.setState({data: orderedData})
              }))
          .then(() => {
            const newGameObject = Object.assign({}, this.state.game)
            newGameObject['gameState'] = WALL
            this.setState({game: newGameObject})
          })
          .catch(console.log)
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
          gameMessage={this.state.game.gameMessage}

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
          gameMessage={this.state.game.gameMessage}
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
          gameMessage={this.state.game.gameMessage}
        />
      )
    } else if (this.state.game.gameState === WIN) {
      return (
        <Win
          days={this.state.progress.days}
          miles={this.state.progress.miles}
          food={this.state.inventory.food}
          health={this.healthRepresentation(this.state.people[0].health)}
          onFinish={this.onFinish}
        />
      )
    } else if (this.state.game.gameState === FINISH) {
      return (
        <div>
          <p>The National Parks Service has turned the walls of a central Ranger
          Station into a monument to those who have taken the trail.</p>
          <p>
            Please enter your name if you want your team remembered on this monument.
            <input type='text' onKeyDown={this.signWall} />
          </p>
          <p>Otherwise, press leave blank and press SPACEBAR or ENTER</p>
        </div>
      )
    } else if (this.state.game.gameState === WALL) {
      return (
        <Wall
          data={this.state.data}
        />
      )
    }
  }
}

export default App
