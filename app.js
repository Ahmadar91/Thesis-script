const config = require('./config')
const db = require('./db')
const fetch = require('node-fetch')

async function getCommits () {
  var headers = {}
  if (config.github.clientId && config.github.clientSecret) {
    headers.Authorization = 'Basic ' + Buffer.from(config.github.clientId + ':' + config.github.clientSecret).toString('base64')
  }
  try {
    // tomcat 11 and 44 58, 62 , 63 -92 - 99 -151
    // jmeter 64, 75, 135, 154, 310
    let page = 154
    let data = []
    do {
      const url = config.repository + '?page=' + page
      console.log(url)
      const res = await fetch(url, {
        method: 'GET',
        headers: headers
      })
      data = await res.json()
      if (data.constructor === Object) {
        console.log('Error: ' + data.message)
        return
      }
      ++page
      parseCommits(data)
      // if (page > 1) break
    } while (data.length > 0)
  } catch (err) {
    console.log(err)
  }
}

function parseCommits (commits) {
  console.log('Commits: ' + commits.length)
  for (let i = 0; i < commits.length; ++i) {
    getCommit(commits[i].url)
  }
}

async function getCommit (url) {
  var headers = {}
  if (config.github.clientId && config.github.clientSecret) {
    headers.Authorization = 'Basic ' + Buffer.from(config.github.clientId + ':' + config.github.clientSecret).toString('base64')
  }
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: headers
    })
    const data = await res.json()
    parseCommit(data)
  } catch (err) {
    console.log(err)
  }
}

function parseCommit (data) {
  const message = data.commit.message
  db.query('INSERT INTO commits SET ?', {
    sha: data.sha,
    message: message,
    date: new Date(data.commit.committer.date),
    url: data.html_url
  })
    .then((next) => {
      // console.log(next)
      parseFiles(next.insertId, data)

      // parseStats(next.insertId, data)
    })
    .catch((err) => {
      console.log('Error: [' + data.sha + ']: ' + err.message)
    })
}

async function parseFiles (commitId, data) {
  for (let i = 0; i < data.files.length; ++i) {
    // console.log(data.commit.committer.date)
    const loc = await downloadFile(data.files[i].raw_url)
    db.query('INSERT INTO files SET ?', {
      commitId: commitId,
      sha: data.sha,
      message: data.commit.message,
      name: data.files[i].filename,
      changes: data.files[i].changes,
      additions: data.files[i].additions,
      deletions: data.files[i].deletions,
      date: new Date(data.commit.committer.date),
      url: data.html_url,
      fileUrl: data.files[i].raw_url,
      loc: loc
    })
      .catch((err) => {
        console.log('Error: [' + data.sha + ']: ' + err.message)
      })
  }
}

async function downloadFile (url) {
  try {
    var headers = {}
    if (config.github.clientId && config.github.clientSecret) {
      headers.Authorization = 'Basic ' + Buffer.from(config.github.clientId + ':' + config.github.clientSecret).toString('base64')
    }
    const res = await fetch(url, {
      method: 'GET',
      headers: headers
    })
    const data = await res.text()
    return data.split(/\r\n|\r|\n/).length - 1
  } catch (err) {
    console.log('Error: [' + url + ']: ' + err.message)
  }

  // console.log(url)
  // console.log('LOC: ' +  data.split(/\r\n|\r|\n/).length - 1)
}

// function parseStats (commitId, data) {
//   console.log(data.commit.committer.date)

//   db.query('INSERT INTO commit SET ?', {

//     sha: data.sha,
//     additions: data.stats.additions,
//     deletions: data.stats.deletions,
//     total: data.stats.total,
//     commitId: commitId,
//     date: new Date(data.commit.committer.date),
//     url: data.html_url
//   })
//     .catch((err) => {
//       console.log('Error: [' + data.sha + ']: ' + err.message)
//     })
// }

db.connect()
getCommits()
