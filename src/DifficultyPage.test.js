import React from 'react'
/* eslint-disable no-unused-vars */
import ReactDOM from 'react-dom'
/* eslint-enable no-unused-vars */
import DifficultyPage from './DifficultyPage'

import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

/* globals beforeEach describe it expect */

describe('integration testing', () => {
  let wrapper
  let handleDifficultyTriggered = false

  beforeEach(() => {
    wrapper = shallow(
      <DifficultyPage
        handleDifficulty={() => { handleDifficultyTriggered = true }}
      />
    )
  })

  it('triggers handleDifficulty when user inputs difficulty level', () => {
    const difficultyInput = wrapper.find('#difficultyInput')
    const e = {}
    difficultyInput.simulate('keyDown', e)
    expect(handleDifficultyTriggered).toBe(true)
  })
})
