const config = require('./config')
const db = require('./db')
const fetch = require('node-fetch')

async function getCommits () {
  var headers = {}
  if (config.github.clientId && config.github.clientSecret) {
    headers.Authorization = 'Basic ' + Buffer.from(config.github.clientId + ':' + config.github.clientSecret).toString('base64')
  }
  try {
    let page = 1
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
    message: message
    // date: data.commit.committer.date
  })
    .then((next) => {
      console.log(next)
      parseFiles(next.insertId, data)
      parseStats(next.insertId, data)
    })
    .catch((err) => {
      console.log('Error: [' + data.sha + ']: ' + err.message)
    })
}

function parseFiles (commitId, data) {
  for (let i = 0; i < data.files.length; ++i) {
    // console.log(data.commit.committer.date)
    db.query('INSERT INTO files SET ?', {
      commitId: commitId,
      sha: data.sha,
      message: data.commit.message,
      name: data.files[i].filename,
      changes: data.files[i].changes,
      additions: data.files[i].additions,
      deletions: data.files[i].deletions,
      date: new Date(data.commit.committer.date)
    })
      .catch((err) => {
        console.log('Error: [' + data.sha + ']: ' + err.message)
      })
  }
}

function parseStats (commitId, data) {
  console.log(data.commit.committer.date)

  db.query('INSERT INTO commit SET ?', {

    sha: data.sha,
    additions: data.stats.additions,
    deletions: data.stats.deletions,
    total: data.stats.total,
    commitId: commitId
  })
    .catch((err) => {
      console.log('Error: [' + data.sha + ']: ' + err.message)
    })
}

db.connect()
getCommits()
