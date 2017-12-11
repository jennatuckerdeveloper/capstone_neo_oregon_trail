import React from 'react'
/* eslint-disable no-unused-vars */
import ReactDOM from 'react-dom'
/* eslint-enable no-unused-vars */
import Pack from './Pack'

import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

/* globals beforeEach describe it expect */

describe('integration testing', () => {
  let onPackingChoiceTriggered = false
  let confirmPackingTriggered = false
  let wrapper

  beforeEach(() => {
    wrapper = shallow(
      <Pack
        waterFilter={3}
        solarPanel={1}
        gps={1}
        tent={4}
        sleepingBag={7}
        clothing={9}
        food={120}
        onPackingChoice={() => { onPackingChoiceTriggered = true }}
        confirmPacking={() => { confirmPackingTriggered = true }}
      />
    )
  })
  it('triggers the key down function onPackingChoice when user enters a packing choice and presses enter', () => {
    const packingChoiceInput = wrapper.find('#packingInput')
    const mockPackingChoiceEvent = {keyCode: 13, target: {value: '1'}}
    packingChoiceInput.simulate('keyDown', mockPackingChoiceEvent)
    expect(onPackingChoiceTriggered).toBe(true)
  })
  it('triggers the key down function confirmPacking when user enters "y" and presses enter', () => {
    const packingConfirmInput = wrapper.find('#finishedPacking')
    const mockPackingConfirmEvent = {keyCode: 13, target: {value: 'y'}}
    packingConfirmInput.simulate('keyDown', mockPackingConfirmEvent)
    expect(confirmPackingTriggered).toBe(true)
  })
})
