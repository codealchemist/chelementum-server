const express = require('express')
const serveStatic = require('serve-static')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
const PBL_PATH = `${process.cwd()}/build/${process.env.MODE === 'PROD' ? 'prod' : 'dev'}`

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(serveStatic(PBL_PATH, { index: ['index.html'] }))

module.exports = app
