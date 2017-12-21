import React, { Component } from 'react'

export default class Wall extends Component {
  render () {
    const wallEntries = this.props.data.map(([key, playerEntry]) => {
      const brickKey = `brick${key}`
      const lost = playerEntry.lost
      const survived = playerEntry.survived
      let lostText
      let survivedText
      if (lost === undefined) {
        if (survived.legnth === 1) {
          survivedText = lost
        } else if (survived.length === 2) {
          survivedText = `${lost[0]} and ${lost[1]}`
        } else if (survived.length > 2) {
          survivedText = survived.map((name, i, a) => {
            if (a.length - 1 === i) {
              return `and ${name}  `
            } else {
              return `${name}, `
            }
          })
        }
        return (
          <div className='brick' id={brickKey} key={brickKey}>
            <p>Took the trail: {survivedText}</p>
          </div>
        )
      } else {
        if (lost.length === 1) {
          lostText = lost
        } else if (lost.length === 2) {
          lostText = `${lost[0]} and ${lost[1]}`
        } else if (lost.length > 2) {
          lostText = lost.map((name, i, a) => {
            if (a.length - 1 === i) {
              return `and ${name}  `
            } else {
              return `${name}, `
            }
          })
        }

        if (survived.legnth === 1) {
          survivedText = survived
        } else if (survived.length === 2) {
          survivedText = `${survived[0]} and ${survived[1]}`
        } else if (survived.length > 2) {
          survivedText = survived.map((name, i, a) => {
            if (a.length - 1 === i) {
              return `and ${name}  `
            } else {
              return `${name}, `
            }
          })
        }
        return (
          <div className='brick' id={key} key={brickKey}>
            <p id='lost' >Lost on the trail: {lostText}</p>
            <p id='survived' >Suvived by: {survivedText}</p>
          </div>
        )
      }
    })
    return (
      <div id='wall'>
        {wallEntries}
      </div>
    )
  }
}
