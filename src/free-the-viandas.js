const store = require('json-fs-store')()
const api = require('./api')

const BASE_PATH = '/rest/free-the-viandas'

api.use((req, res, next) => {
  if (req.path.indexOf(BASE_PATH) === 0 && (!req.cookies.employee_id || !req.cookies.chef_pass)) {
    res.status(401).send({
      message: 'You did not provide credentials. Please Login.'
    })
  } else {
    next()
  }
})

api.get(BASE_PATH, (req, res, next) => {
  const id = req.cookies.employee_id
  store.load(id, (err, obj) => {
    if (err && err.match(/no such file or directory/)) {
      return res.send(null)
    }

    if (err) {
      return res.status(500).send(`Error trying to get data for user ${id}`)
    }

    res.send(obj)
  })
})

api.get(`${BASE_PATH}/list`, (req, res, next) => {
  store.list((err, list) => {
    if (err) {
      return res.status(500).send('Error trying to get free viandas list.')
    }

    res.send(list)
  })
})

api.post(BASE_PATH, (req, res, next) => {
  const data = req.body
  store.add(data, err => {
    if (err) {
      return res.status(500).send(`Error trying to free vianda for user ${data.id}`)
    }

    res.send({ ok: true })
  })
})

api.delete(BASE_PATH, (req, res, next) => {
  const id = req.cookies.employee_id
  store.remove(id, (err, obj) => {
    if (err) {
      return res.status(500).send(`Error trying to unfree vianda for user ${req.cookies.employee_id}`)
    }

    res.send({ ok: true })
  })
})
