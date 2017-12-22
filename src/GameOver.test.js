import React from 'react'
/* eslint-disable no-unused-vars */
import ReactDOM from 'react-dom'
/* eslint-enable no-unused-vars */
import GameOver from './GameOver'

import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

/* globals beforeEach describe it expect */

describe('integration testing', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(
      <GameOver
        days={3}
        miles={123}
        food={111}
        gameMessage={'You have died of hunger and exhaustion.'}
      />
    )
  })
  it('displays the days', () => {
    const dayCountDisplayed = wrapper.find('#dayCount').text()
    expect(dayCountDisplayed).toBe('Days on the trail: 3')
  })
  it('displays the days', () => {
    const dayCountDisplayed = wrapper.find('#mileCount').text()
    expect(dayCountDisplayed).toBe('Miles: 123')
  })
  it('displays the days', () => {
    const dayCountDisplayed = wrapper.find('#foodCount').text()
    expect(dayCountDisplayed).toBe('Food: 111')
  })
  it('displays the days', () => {
    const dayCountDisplayed = wrapper.find('#gameMessage').text()
    expect(dayCountDisplayed).toBe('You have died of hunger and exhaustion.')
  })
})
