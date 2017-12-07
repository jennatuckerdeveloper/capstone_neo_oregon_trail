import React from 'react'
/* eslint-disable no-unused-vars */
import ReactDOM from 'react-dom'
/* eslint-enable no-unused-vars */
import PlayMenu from './PlayMenu'

import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

/* globals beforeEach describe it expect */

describe('integration testing', () => {
  let onUserPlayTriggered = false
  let wrapper

  beforeEach(() => {
    wrapper = shallow(
      <PlayMenu
        days={0}
        miles={0}
        food={120}
        health={100}
        onUserPlay={() => { onUserPlayTriggered = true }}
      />
    )
  })
  it('triggers the onKeyDown when user makes a play', () => {
    const playInput = wrapper.find('#play')
    playInput.simulate('keyDown')
    expect(onUserPlayTriggered).toEqual(true)
  })
})
