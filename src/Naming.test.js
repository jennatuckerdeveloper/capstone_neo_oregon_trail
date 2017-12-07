import React from 'react'
/* eslint-disable no-unused-vars */
import ReactDOM from 'react-dom'
/* eslint-enable no-unused-vars */
import Naming from './Naming'

import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

/* globals beforeEach describe it expect */

describe('integration testing', () => {
  let handleNameTriggered = 0
  let onConfirmTriggered = false
  let wrapper

  beforeEach(() => {
    wrapper = shallow(
      <Naming
        handleName={() => { handleNameTriggered += 1 }}
        onConfirm={() => { onConfirmTriggered = true }}
      />
    )
  })
  it('triggeres the onKeyDown when user inputs a name into each of four input fields', () => {
    const fourHandleNames = 4
    const nameInputs = wrapper.find('.people')
    nameInputs.forEach((nameInput) => {
      nameInput.simulate('change')
    })
    expect(handleNameTriggered).toEqual(fourHandleNames)
  })
  it('triggers the confirm when user enters something into confirmName input field', () => {
    const confirmationInput = wrapper.find('#confirmNames')
    confirmationInput.simulate('keyDown')
    expect(onConfirmTriggered).toBe(true)
  })
})
