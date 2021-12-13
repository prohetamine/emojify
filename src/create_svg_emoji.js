const fs = require('fs')



Object.values({ '1': { name: 'love letter' } }).map(e => {
  fs.writeFileSync(__dirname+'/svg/'+e.name+'.svg', `<svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0H75V75H0V0Z" fill="#C4C4C4"/>
  </svg>`)
})
