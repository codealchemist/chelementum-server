const rp = require('request-promise')
const API_URI = require('../constants').API_URI
const CHEF_PASS = require('../constants').CHEF_PASS

const me = {}

me.login = params => {
  return rp
    .get({
      uri: API_URI + '/login',
      qs: {
        username: params.username,
        company: params.company,
        password: params.password,
        chef_pass: CHEF_PASS
      },
      json: true
    })
    .then(response => {
      if (!response.result) {
        return Promise.reject('Wrong user or password.')
      }

      const result = Object.assign(response.result, {
        company: params.company,
        permissions: ['home', 'orders', 'free-the-viandas', 'change-password', 'logout', 'orders', 'about']
      })

      return { result }
    })
}

module.exports = me
