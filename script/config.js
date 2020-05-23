require('dotenv').config()
module.exports = {
  repository: process.env.REPOSITORY,
  github: {
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET
  },
  database: {
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  }
}
