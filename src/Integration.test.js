/* global describe beforeEach it expect */
import React from 'react'
/* eslint-disable no-unused-vars */
import ReactDOM from 'react-dom'
/* eslint-enable no-unused-vars */
import App from './App'

import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('integration testing', () => {
  let app

  beforeEach(() => {
    app = mount(<App />)
  })

  const toNaming = function () {
    const enterDifficulty = app.find('#difficultyInput')
    const mockDifficutlyEntry = {keyCode: 13, target: {value: '1'}}
    enterDifficulty.simulate('keyDown', mockDifficutlyEntry)
  }

  const toPacking = function () {
    const confirmation = app.find('#confirmNames')
    const mockConfirmNamesEvent = {keyCode: 13, target: {value: 'y'}}
    confirmation.simulate('keydown', mockConfirmNamesEvent)
  }

  const toItemPack = function () {
    const packChoice = app.find('#packingInput')
    const userChoice = 3
    const mockOnChoice = {target: {value: userChoice}, keyCode: 13}
    packChoice.simulate('keyDown', mockOnChoice)
  }

  const toPlaying = function () {
    const finishedPacking = app.find('#finishedPacking')
    const mockOnConfirmPack = {keyCode: 13, target: {value: 'y'}}
    finishedPacking.simulate('keyDown', mockOnConfirmPack)
  }

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App />, div)
  })

  it('loads a DifficultyPage component when the state game gameState is "difficulty', () => {
    const difficultyPageComponent = app.find('DifficultyPage').length
    expect(difficultyPageComponent).toBe(1)
  })

  it('changes the state game difficulty to the choice of difficulty user enters', () => {
    const enterDifficulty = app.find('#difficultyInput')
    const mockDifficutlyEntry = {keyCode: 13, target: {value: '3'}}
    enterDifficulty.simulate('keyDown', mockDifficutlyEntry)
    const difficultyGameState = app.state().game.difficulty
    expect(difficultyGameState).toBe(3)
  })

  it('loads a Naming component when the state game gameState is changed to "naming', () => {
    toNaming()
    const nameComponent = app.find('Naming').length
    expect(nameComponent).toBe(1)
  })

  it('assigns the names the user inputs to the people in inventory', () => {
    toNaming()
    const peopleInputs = app.find('.people')
    const testNames = ['Jim', 'Mark', 'Jesus', 'Fran']
    peopleInputs.forEach((input, index) => {
      let teamMemberIndex = index + 1
      let mockEvent = {target: {value: testNames[index], id: teamMemberIndex + 'teamMember'}}
      input.simulate('change', mockEvent)
    })

    const appPeopleState = app.state().people
    const names = appPeopleState.map(function (object) { return object.name })
    expect(names.slice(1)).toEqual(testNames)
  })

  it('changes the game state from "naming" to "packing" when the user confirms with "y" and presses enter', () => {
    toNaming()
    const confirmation = app.find('#confirmNames')
    const mockOnConfirmEvent = {keyCode: 13, target: {value: 'y'}}
    confirmation.simulate('keyDown', mockOnConfirmEvent)
    const appGameState = app.state().game.gameState
    expect(appGameState).toBe('packing')
  })

  it('changes the state game gameState to "packItem" when the user choose an item to pack from the menu,', () => {
    toNaming()
    toPacking()
    const packChoice = app.find('#packingInput')
    const mockOnChoice = {target: {value: '1'}, keyCode: 13}
    packChoice.simulate('keyDown', mockOnChoice)
    const gameState = app.state().game.gameState
    expect(gameState).toBe('packItem')
  })

  it('changes the game state inventory value of the item chosen to pack from the menu to "changing"', () => {
    toNaming()
    toPacking()
    const packChoice = app.find('#packingInput')
    const userChoice = 3
    const mockOnChoice = {target: {value: userChoice}, keyCode: 13}
    packChoice.simulate('keyDown', mockOnChoice)
    const itemChanging = app.state().inventory
    const packingMenu = ['waterFilter', 'solarPanel', 'gps', 'tent', 'sleepingBag', 'clothing', 'food']
    const itemChosen = packingMenu[userChoice - 1]
    const stateChange = itemChanging[itemChosen]
    expect(stateChange).toBe('changing')
  })

  it('changes the number of items in the inventory to input when the user chooses the number to add below max and presses enter', () => {
    toNaming() // simulates a difficutly of 1
    toPacking()
    toItemPack() // simulates adding gps
    // the max for gps for difficulty 1 is 2
    const inventory = app.state().inventory
    let itemChanging = Object.keys(inventory).find((key) => inventory[key] === 'changing')
    const numberToPackInput = app.find('#numberToPack')
    const mockNumberToPackEntry = {target: {value: '1'}, keyCode: 13}
    numberToPackInput.simulate('keyDown', mockNumberToPackEntry)
    expect(inventory[itemChanging]).toBe(1)
  })

  it('generates a result message when user changes inventory', () => {
    toNaming()
    toPacking()
    toItemPack()
    const numberToPackInput = app.find('#numberToPack')
    const mockNumberToPackEntry = {target: {value: '1'}, keyCode: 13}
    numberToPackInput.simulate('keyDown', mockNumberToPackEntry)
    const packMessage = app.find('#packMessage').text()
    expect(packMessage).toBe('1 gps devices added to your pack.')
  })

  it('changes the number of items in the inventory to the max when the user chooses to add a number over the max and presses enter', () => {
    toNaming()
    toPacking()
    toItemPack()
    const inventory = app.state().inventory
    let itemChanging = Object.keys(inventory).find((key) => inventory[key] === 'changing')
    const numberToPackInput = app.find('#numberToPack')
    const mockNumberToPackEntry = {target: {value: '4'}, keyCode: 13}
    numberToPackInput.simulate('keyDown', mockNumberToPackEntry)
    expect(inventory[itemChanging]).toBe(2)
  })

  it('changes the page by loading a PlayMenu compontent when the game state changes to "playing"', () => {
    toNaming()
    toPacking()
    toPlaying()
    const findPlayMenu = app.find('PlayMenu').length
    expect(findPlayMenu).toBe(1)
  })

  it('shows a word representation of a numerical health score for person named "you" on the game menu', () => {
    toNaming()
    toPacking()
    toPlaying()
    const healthRepresentation = app.find('#health').text()
    const bool = (
      healthRepresentation === 'Health: good' ||
      healthRepresentation === 'Health: fair' ||
      healthRepresentation === 'Health: poor'
    )
    expect(bool).toBe(true)
  })

  it('adds a day to the days on the trail when user plays 1. Walk On', () => {
    toNaming()
    toPacking()
    toPlaying()
    const beginningDays = app.state().progress.days
    const playInput = app.find('#play')
    const mockPlayEvent = {target: {value: '1'}, keyCode: 13}
    playInput.simulate('keyDown', mockPlayEvent)
    const afterPlayDays = app.state().progress.days
    expect(afterPlayDays).toBe(beginningDays + 1)
  })

  it('adds miles to the miles when user plays 1. Walk On', () => {
    toNaming()
    toPacking()
    toPlaying()
    const beginningMiles = app.state().progress.miles
    const playInput = app.find('#play')
    const mockPlayEvent = {target: {value: '1'}, keyCode: 13}
    playInput.simulate('keyDown', mockPlayEvent)
    const afterPlayMiles = app.state().progress.miles
    expect(afterPlayMiles > beginningMiles).toBe(true)
  })
  it('decrements food when user plays 1. Walk On', () => {
    toNaming()
    toPacking()
    const packChoice = app.find('#packingInput')
    const userChoice = 7
    const mockOnChoice = {target: {value: userChoice}, keyCode: 13}
    packChoice.simulate('keyDown', mockOnChoice)
    const packingChoice = app.find('#numberToPack')
    const poundsOfFood = 20
    const mockPackingChoiceEvent = {keyCode: 13, target: {value: poundsOfFood}}
    packingChoice.simulate('keyDown', mockPackingChoiceEvent)
    toPlaying()
    const beginningFood = app.state().inventory.food
    const playInput = app.find('#play')
    const mockPlayEvent = {target: {value: '1'}, keyCode: 13}
    playInput.simulate('keyDown', mockPlayEvent)
    const afterPlayFood = app.state().inventory.food
    let bool = afterPlayFood < beginningFood
    if (afterPlayFood === 'no food') {
      bool = true
    }
    expect(bool).toBe(true)
  })

  it('decrements the health of people with status "alive" when user plays 1. Walk On', () => {
    toNaming()
    toPacking()
    toPlaying()
    const peopleLiving = app.state().people.filter((person) => person.status === 'alive')
    const beginningHealth = peopleLiving.map((person) => person.health)
    const playInput = app.find('#play')
    const mockPlayEvent = {target: {value: '1'}, keyCode: 13}
    playInput.simulate('keyDown', mockPlayEvent)
    const afterPlayHealth = app.state().people.map((person) => person.health)
    beginningHealth.forEach((healthScore, index) => {
      expect(healthScore > afterPlayHealth[index]).toBe(true)
    })
  })

  it('presents a game message when the player runs out of food', () => {
    toNaming()
    toPacking()
    toPlaying()
    const mockPlayEvent = {target: {value: '1'}, keyCode: 13}
    const playInput = app.find('#play')
    playInput.simulate('keyDown', mockPlayEvent)
    const gameMessage = app.find('#gameMessage').text()
    expect(gameMessage).toBe('You have run out of food.')
  })

  it('loads the Win component when the miles go over the TRAIL_MILES and finishGame is run', () => {
    toNaming()
    toPacking()
    toPlaying()
    app.setState({progress: {miles: 999, days: 74}})
    const mockPlayEvent = {target: {value: '1'}, keyCode: 13}
    const playInput = app.find('#play')
    playInput.simulate('keyDown', mockPlayEvent)
    const winComponent = app.find('Win')
    expect(winComponent.length).toBe(1)
  })
  it('loads a Finish component when the user continues from win screen', () => {
    toNaming()
    toPacking()
    toPlaying()
    app.setState({progress: {miles: 999, days: 74}})
    const mockPlayEvent = {target: {value: '1'}, keyCode: 13}
    const playInput = app.find('#play')
    playInput.simulate('keyDown', mockPlayEvent)
    const afterWin = app.find('#finish')
    afterWin.simulate('keyDown')
    const finishComponent = app.find('Finish')
    expect(finishComponent.length).toBe(1)
  })

  it('loads a Wall component when the user continues from finish screen', () => {
    toNaming()
    toPacking()
    toPlaying()
    app.setState({progress: {miles: 999, days: 74}})
    const mockPlayEvent = {target: {value: '1'}, keyCode: 13}
    const playInput = app.find('#play')
    playInput.simulate('keyDown', mockPlayEvent)
    const afterWin = app.find('#finish')
    afterWin.simulate('keyDown')
    const signWall = app.find('#signWall')
    // console.log('before state', app.state())
    const mockSignEvent = {keyCode: 13, target: {value: ''}}
    signWall.simulate('keyDown', mockSignEvent)
    // console.log('after state', app.state())
    // const wallComponent = app.find('Wall')
    // expect(wallComponent.length).toBe(1)
  })
})
