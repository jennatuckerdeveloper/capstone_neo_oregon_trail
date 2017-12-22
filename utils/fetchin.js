const fetch = require('node-fetch')

const pkg = {
  method: 'POST',
  body: JSON.stringify({
    survived: ['Joe', 'Fran'],
    lost: ['Phil', 'Dan', 'Jack']
  })
}

fetch('https://neo-oregon-trail.firebaseio.com/wall.json', pkg)
  .then(console.log('fetch ran post!'))
  .catch(console.log)
