import React from 'react'
/* eslint-disable no-unused-vars */
import ReactDOM from 'react-dom'
/* eslint-enable no-unused-vars */
import Wall from './Wall'

import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

/* globals beforeEach describe it expect */

// put the proper data in the databse to get this back
// copy the curl return and pass it into data

describe('integration testing', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(
      <Wall
        data={[
          ['-L0uG5PXW0U1U7L1NTW4', { 'survived': ['Lizzy', 'James', 'Ashley', 'Clara', 'Mo'] }],
          ['-L0uGFGm9SHKAOfhooS9', { 'lost': ['Josh'], 'survived': ['Brian', 'Bonnie', 'Ilona', 'Hawker'] }],
          ['-L0uGQ0x9EELcLMZtyRD', { 'lost': ['Anna', 'Benjamin'], 'survived': ['Dannie', 'Willow', 'Remy'] }],
          ['-L0uG_kOCdIIYpzQsp6M', { 'lost': ['Eustice', 'Marlow', 'Johnathan'], 'survived': ['Sam', 'Eric'] }]
        ]}
      />
    )
  })
  // it('displays a brick for each of the values in data', () => {

  // })
  it('displays a brick with only surviving characters properly', () => {
    const fiveSurvivors = wrapper.find('#brick-L0uG5PXW0U1U7L1NTW4')
    const brickText = fiveSurvivors.text()
    expect(brickText).toBe('Took the trail: Lizzy, James, Ashley, Clara, and Mo  ')
  })
  it('displays a brick with one character who died properly', () => {
    const fourSurvivors = wrapper.find('#brick-L0uGFGm9SHKAOfhooS9')
    console.log(fourSurvivors)
    // const brickText = fiveSurvivors.text()
    // expect(brickText).toBe('Took the trail: Lizzy, James, Ashley, Clara, and Mo  ')
  })
  // it('displays a brick with two characters who died properly', () => {
  //   const dayCountDisplayed = wrapper.find('#dayCount').text()
  //   expect(dayCountDisplayed).toBe('Days on the trail: 3')
  // })
  // it('displays a brick with three or more charactrers who died properly', () => {

  // })
  // it('displays more than one brick properly', () => {

  // })
})
