const api = require('./api')
const constants = require('./constants')

require('./router')
const PORT = process.env.PORT || constants.PORT
api.listen(PORT, () => {
  console.log(`Server started on ${PORT}`)
})
