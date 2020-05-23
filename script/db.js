const mysql = require('mysql')
const config = require('./config')

const state = {
  pool: null
}

exports.connect = function (callback) {
  state.pool = mysql.createPool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    dateStrings: true// this will fix an issue with timezone
  })
  if (callback !== undefined) {
    callback()
  }
}

exports.query = (statment, values = []) => {
  return new Promise((resolve, reject) => {
    state.pool.query(statment, values, (err, result) => {
      if (err) {
        reject(new Error(err))
        return
      }
      resolve(result)
    })
  })
}

exports.get = function () {
  return state.pool
}
