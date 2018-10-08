const api = require('../api')
const model = require('./model')

const BASE_PATH = '/rest/orders'

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
  const params = req.query
  model
    .getList({
      employee_id: req.cookies.employee_id,
      chef_pass: req.cookies.chef_pass,
      date_from: params.date_from,
      date_to: params.date_to
    })
    .then(response => {
      res.send(response)
    })
    .catch(next)
})

api.post(BASE_PATH + '/:order_id?', (req, res, next) => {
  const data = Object.assign(req.params, req.body)

  model
    .save(
    {
      employee_id: req.cookies.employee_id,
      chef_pass: req.cookies.chef_pass
    },
      data
    )
    .then(response => {
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

api.get(BASE_PATH + '/calendar', (req, res, next) => {
  const params = {
    employee_id: req.cookies.employee_id,
    chef_pass: req.cookies.chef_pass,
    date_from: req.query.date_from,
    date_to: req.query.date_to
  }

  const days = model.getByDays(params)
  const orders = model.getList(params)

  Promise.all([days, orders])
    .then(([days, orders]) => {
      const results = days.map(day => {
        if (day.order_id) {
          const order = orders.find(order => order.order_id === day.order_id)
          day.entrada = order.entrada
          day.plato_principal = order.plato_principal
          day.bebida = order.bebida
          day.postre = order.postre
        }
        return day
      })

      res.send({
        results,
        range: {
          date_from: params.date_from,
          date_to: params.date_to
        }
      })
    })
    .catch(next)
})

api.get(BASE_PATH + '/menus/:menu_id', (req, res, next) => {
  const params = Object.assign(req.query, req.params)
  model
    .get({
      employee_id: req.cookies.employee_id,
      chef_pass: req.cookies.chef_pass,
      menu_id: params.menu_id,
      date: params.date
    })
    .then(response => {
      res.send(response)
    })
    .catch(next)
})
