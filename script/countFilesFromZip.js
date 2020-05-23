const unzipper = require('unzipper')
const fs = require('fs')
const db = require('./db')
db.connect()
fs.createReadStream('jenkins-jenkins-2.221.zip')
  .pipe(unzipper.Parse())
  .on('entry', async function (entry) {
    const fileName = entry.path
    if (fileName.includes('.java')) {
      // if (!fileName.includes('/test/')) {
      console.log(fileName)
      const content = await entry.buffer()
      // console.log(content.toString().split(/\r\n|\r|\n/).length - 1)
      db.query('INSERT INTO releases SET ?', {
        release: '2.221',
        fileName: fileName,
        loc: content.toString().split(/\r\n|\r|\n/).length - 1
      }).catch((err) => {
        console.log('Error: [' + fileName + ']: ' + err.message)
      })
      // }
    }
    entry.autodrain()
  })
