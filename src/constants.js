const md5 = require('md5')
const me = {}

me.PORT = 19090
me.CHEF_PASS = md5('chefgourmet')
me.API_URI = 'https://admin.quilsoft.com/chef-gourmet/public/ws'

module.exports = me
