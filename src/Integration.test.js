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

  it('loads a Naming component when the state game gameState is "naming', () => {
    const nameComponent = app.find('Naming').length
    expect(nameComponent).toBe(1)
  })

  it('assigns the names the user inputs to the people in inventory', () => {
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

  it('changes the game state from "naming" to "playing" when the user confirms with "y" and presses enter', () => {
    const confirmation = app.find('#confirmNames')
    const mockOnConfirmEvent = {target: {value: 'y'}}
    confirmation.simulate('keyDown', mockOnConfirmEvent)
    const appGameState = app.state().game.gameState
    expect(appGameState).toBe('playing')
  })

  it('changes the page from naming to playing when the game state changes', () => {
    const confirmation = app.find('#confirmNames')
    const mockOnConfirmEvent = {target: {value: 'y'}}
    confirmation.simulate('keyDown', mockOnConfirmEvent)
    const findPlayMenu = app.find('PlayMenu').length
    expect(findPlayMenu).toBe(1)
  })

  it('shows a word representation of a numerical health score for person named "you" on the game menu', () => {
    const confirmation = app.find('#confirmNames')
    const mockOnConfirmEvent = {target: {value: 'y'}}
    confirmation.simulate('keyDown', mockOnConfirmEvent)
    const healthRepresentation = app.find('#health').text()
    const bool = (
      healthRepresentation === 'Health: good' ||
      healthRepresentation === 'Health: fair' ||
      healthRepresentation === 'Health: poor'
    )
    expect(bool).toBe(true)
  })

  it('adds a day to the days on the trail when user plays 1. Walk On', () => {
    const confirmation = app.find('#confirmNames')
    const mockOnConfirmEvent = {target: {value: 'y'}}
    confirmation.simulate('keyDown', mockOnConfirmEvent)
    const beginningDays = app.state().progress.days
    const playInput = app.find('#play')
    const mockPlayEvent = {target: {value: '1'}, keyCode: 13}
    playInput.simulate('keyDown', mockPlayEvent)
    const afterPlayDays = app.state().progress.days
    expect(afterPlayDays).toBe(beginningDays + 1)
  })

  it('adds miles to the miles when user plays 1. Walk On', () => {
    const confirmation = app.find('#confirmNames')
    const mockOnConfirmEvent = {target: {value: 'y'}}
    confirmation.simulate('keyDown', mockOnConfirmEvent)
    const beginningMiles = app.state().progress.miles
    const playInput = app.find('#play')
    const mockPlayEvent = {target: {value: '1'}, keyCode: 13}
    playInput.simulate('keyDown', mockPlayEvent)
    const afterPlayMiles = app.state().progress.miles
    expect(afterPlayMiles > beginningMiles).toBe(true)
  })
  it('decrements food when user plays 1. Walk On', () => {
    const confirmation = app.find('#confirmNames')
    const mockOnConfirmEvent = {target: {value: 'y'}}
    confirmation.simulate('keyDown', mockOnConfirmEvent)
    const beginningFood = app.state().inventory.food
    const playInput = app.find('#play')
    const mockPlayEvent = {target: {value: '1'}, keyCode: 13}
    playInput.simulate('keyDown', mockPlayEvent)
    const afterPlayFood = app.state().inventory.food
    expect(afterPlayFood < beginningFood).toBe(true)
  })

  it('decrements the health of people with status "alive" when user plays 1. Walk On', () => {
    const confirmation = app.find('#confirmNames')
    const mockOnConfirmEvent = {target: {value: 'y'}}
    confirmation.simulate('keyDown', mockOnConfirmEvent)
    const peopleLiving = app.state().people.filter((person) => person.status === 'alive')
    const beginningHealth = peopleLiving.map((person) => person.health)
    const playInput = app.find('#play')
    const mockPlayEvent = {target: {value: '1'}, keyCode: 13}
    playInput.simulate('keyDown', mockPlayEvent)
    const afterPlayPeopleLiving = app.state().people.filter((person) => person.status === 'alive')
    const afterPlayHealth = afterPlayPeopleLiving.map((person) => person.health)
    beginningHealth.forEach((healthScore, index) => {
      expect(healthScore > afterPlayHealth[index]).toBe(true)
    })
  })
})
