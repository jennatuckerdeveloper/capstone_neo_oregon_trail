/* globals beforeEach describe it expect */

import React from 'react'
import App from './App'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

describe('integration testing', () => {
  let wrapper
  let app

  beforeEach(() => {
    wrapper = shallow(<App />)
    app = wrapper.instance()
  })

  it('returns a people object with one person with the status depressed when badLuck is true and luck is 1', () => {
    const peopleList = app.state.people
    const changedList = app.randomCharacterDeath(peopleList, true, 1)
    const depressed = changedList.find((person) => person.status === 'depressed')
    const bool = depressed !== undefined
    expect(bool).toBe(true)
  })

  it('returns a people object with one person with the status dead when a person status is "depressed", badLuck is true, luck is 2', () => {
    app.setState({people: [{name: 'Joe', status: 'depressed', health: 80}]})
    const peopleList = app.state.people
    const changedList = app.randomCharacterDeath(peopleList, true, 2)
    const depressed = changedList.find((person) => person.status === 'dead')
    const bool = depressed !== undefined
    expect(bool).toBe(true)
  })

  it('returns a people object unchanged when badLuck is true and luck is 3', () => {
    const peopleList = app.state.people
    const changedList = app.randomCharacterDeath(peopleList, true, 3)
    const bool = peopleList === changedList
    expect(bool).toBe(true)
  })

  it('returns a a people object unchanged when badLuck is false', () => {
    const peopleList = app.state.people
    const changedList = app.randomCharacterDeath(peopleList, false, 'x')
    const bool = peopleList === changedList
    expect(bool).toBe(true)
  })
  it('changes the gameState to "win" when the TRAIL_MILES are reached', () => {
    // TRAIL_MILES is a const in App.js
    app.setState({progress: {miles: 1000, days: 74}})
    app.finishGame(app.state.progress)
    const gameState = app.state.game.gameState
    expect(gameState).toBe('win')
  })
})
