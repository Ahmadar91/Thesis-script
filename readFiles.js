const unzipper = require('unzipper')
const fs = require('fs')
const db = require('./db')
db.connect()
fs.createReadStream('jfreechart-1.5.0.zip')
  .pipe(unzipper.Parse())
  .on('entry', function (entry) {
    const fileName = entry.path
    if (fileName.includes('.java')) {
      if (!fileName.includes('/test/')) {
        console.log(fileName)
        db.query('INSERT INTO releases SET ?', {
          release: '1.5.0',
          fileName: fileName
        }).catch((err) => {
          console.log('Error: [' + fileName + ']: ' + err.message)
        })
      }
    }
    entry.autodrain()
  })

// async function readFiles () {
//   try {
//     const zip = fs.createReadStream('jfreechart-1.5.0.zip').pipe(unzipper.Parse({ forceStream: true }))
//     for await (const entry of zip) {
//       const fileName = entry.path
//       if (fileName.includes('.java')) {
//         if (!fileName.includes('/test/')) {
//           console.log(fileName)
//           db.query('INSERT INTO releases SET ?', {
//             release: '1.5.0',
//             fileName: fileName
//           }).catch((err) => {
//             console.log('Error: [' + fileName + ']: ' + err.message)
//           })
//         }
//       } else {
//         entry.autodrain()
//       }
//     }
//   } catch (err) {
//     console.log(err.message)
//   }
// }
// readFiles()
