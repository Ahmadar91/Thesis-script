const config = require('./config')
const db = require('./db')
const fetch = require('node-fetch')

async function getCommits () {
  var headers = {}
  if (config.github.clientId && config.github.clientSecret) {
    headers.Authorization = 'Basic ' + Buffer.from(config.github.clientId + ':' + config.github.clientSecret).toString('base64')
  }
  try {
    let page = 199
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
    } while (data.length > 0)
  } catch (err) {
    console.log(err.message)
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
      parseFiles(next.insertId, data)
    })
    .catch((err) => {
      console.log('Error: [' + data.sha + ']: ' + err.message)
    })
}

async function parseFiles (commitId, data) {
  for (let i = 0; i < data.files.length; ++i) {
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
}
db.connect()
getCommits()
