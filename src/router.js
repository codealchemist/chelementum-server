const api = require('./api')

require('./auth')
require('./orders')
require('./free-the-viandas')

api.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send({
    message: err.message
  })
})

api.use((req, res, next) => {
  res.status(404).send({
    message: 'Object not found.'
  })
})
