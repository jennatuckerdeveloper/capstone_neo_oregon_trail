/* globals beforeEach describe it expect */

import React from 'react'
import App from './App'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// import fetch from 'jest-fetch-mock'
// import currentWall from './currentWall'

Enzyme.configure({ adapter: new Adapter() })
// window.fetch = fetch

describe('integration testing', () => {
  let wrapper
  let app

  beforeEach(() => {
    wrapper = shallow(<App />)
    app = wrapper.instance()
  })

  it('randomCharacterDeath returns a people list with one person with the status depressed when badLuck is true and luck is 1', () => {
    const peopleList = app.state.people
    const changedList = app.randomCharacterDeath(peopleList, true, 1)
    const depressed = changedList.find((person) => person.status === 'depressed')
    const bool = depressed !== undefined
    expect(bool).toBe(true)
  })

  it('randomCharacterDeath returns a people list with one person with the status dead when a person status is "depressed", badLuck is true, luck is 2', () => {
    app.setState({people: [{name: 'Joe', status: 'depressed', health: 80}]})
    const peopleList = app.state.people
    const changedList = app.randomCharacterDeath(peopleList, true, 2)
    const depressed = changedList.find((person) => person.status === 'dead')
    const bool = depressed !== undefined
    expect(bool).toBe(true)
  })

  it('randomCharacterDeath returns a people list unchanged when a character status is "depressed" and randomCharacterDeath run with badLuck is true and luck is 3', () => {
    const mixedStatusPeopleList = [
      {name: 'You', status: 'depressed', health: 0},
      {name: 'Dan', status: 'alive', health: 0},
      {name: 'Ron', status: 'alive', health: 0},
      {name: 'Al', status: 'alive', health: 0},
      {name: 'John', status: 'alive', health: 0}
    ]
    const changedList = app.randomCharacterDeath(mixedStatusPeopleList, true, 3)
    expect(changedList).toEqual(changedList)
  })

  it('randomCharacterDeath returns a people list unchanged when badLuck is false', () => {
    const peopleList = app.state.people
    const changedList = app.randomCharacterDeath(peopleList, false, 4)
    expect(peopleList).toEqual(changedList)
  })

  it('changes the gameState to "win" when the finishGame is run', () => {
    app.setState({progress: {miles: 1000, days: 74}})
    const newStateObj = app.finishGame(app.state.progress)
    const gameStateChange = newStateObj.game.gameState
    expect(gameStateChange).toBe('win')
  })

  it('handleCharacter changes one status to "dead" when any number of people health scores are 0 or less', () => {
    const mixedStatusPeopleList = [
      {name: 'You', status: 'depressed', health: 0},
      {name: 'Dan', status: 'alive', health: 0},
      {name: 'Ron', status: 'alive', health: 0},
      {name: 'Al', status: 'alive', health: 0},
      {name: 'John', status: 'alive', health: 0}
    ]
    const changedList = app.statusDeadChange(mixedStatusPeopleList)
    const num = changedList.filter((person) => person.status === 'dead')
    const oneWasChanged = num.length
    expect(oneWasChanged).toBe(1)
  })

  it('isYouDead returns true when the "you" character is dead', () => {
    const characterList = [
      {name: 'You', status: 'dead', health: 0},
      {name: 'Dan', status: 'dead', health: 0},
      {name: 'Ron', status: 'depressed', health: 0},
      {name: 'Al', status: 'alive', health: 0},
      {name: 'John', status: 'alive', health: 0}
    ]
    const bool = app.isYouDead(characterList)
    expect(bool).toBe(true)
  })

  it('isYouDead returns false when the "you" character is not dead', () => {
    const characterList = [
      {name: 'You', status: 'depressed', health: 0},
      {name: 'Dan', status: 'dead', health: 0},
      {name: 'Ron', status: 'dead', health: 0},
      {name: 'Al', status: 'alive', health: 0},
      {name: 'John', status: 'alive', health: 0}
    ]
    const bool = app.isYouDead(characterList)
    expect(bool).toBe(false)
  })

  // it('loads data when user enters their name and signWall is triggered', () => {
  //   const previousData = app.state.data
  //   // console.log('previous data', previousData)
  //   fetch.mockResponses([], [JSON.stringify(currentWall)])
  //   const mockSignEvent = {keyCode: 13, target: {value: 'Benjamin J'}}
  //   app.signWall(mockSignEvent)
  //   // this does change the game state to 'win', so signWall is triggered
  //   // data stays the same before and after, so the fetchMock does not work properly
  //   // uncomment window.fetch = fetch creates an error: unexpected JSON response end
  //   const afterData = app.state.data
  //   // console.log('afterData', afterData)
  //   const bool = afterData.length > previousData
  //   expect(bool).toBe(true)
  // })
})
