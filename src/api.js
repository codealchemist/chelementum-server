const path = require('path')
const express = require('express')
const cors = require('cors')
const serveStatic = require('serve-static')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
const env = process.env.MODE === 'PROD' ? 'prod' : 'dev'
const PBL_PATH = `${process.cwd()}/build/${env}`

// set cors options
const whitelistFile = path.join(__dirname, './whitelist.json')
const whitelist = require(whitelistFile)
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) return callback('Origin Not Allowed (empty)', false)

    var isAllowed = whitelist.some(allowedDomain => {
      return origin.match(`^${allowedDomain}`)
    })

    // allowed domain
    if (isAllowed) return callback(null, true)

    // not allowed domain
    callback(`Origin Not Allowed: ${origin}`, false)
  }
}

app.use(cookieParser())
if (env === 'prod') app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(serveStatic(PBL_PATH, { index: ['index.html'] }))

module.exports = app
