const api = require('../api')
const model = require('./model')
const CHEF_PASS = require('../constants').CHEF_PASS

api.post('/rest/auth/login', (req, res, next) => {
  const params = req.body

  model
    .login({
      username: params.username,
      company: params.company,
      password: params.password
    })
    .then(response => {
      const cookie = {
        httpOnly: true,
        maxAge: 31556952000
      }
      res.cookie('employee_id', response.result.id, cookie)
      res.cookie('chef_pass', CHEF_PASS, cookie)
      res.send(response)
    })
    .catch(response => {
      if (response instanceof Error) {
        return next(response)
      }
      res.status(400).send({
        message: response
      })
    })
})

api.delete('/rest/auth/logout', (req, res, next) => {
  res.clearCookie('employee_id')
  res.clearCookie('chef_pass')
  res.send({
    message: 'Success'
  })
})
