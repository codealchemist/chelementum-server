const rp = require('request-promise')
const API_URI = require('../constants').API_URI

const me = {}

const getStatus = (order = {}) => {
  if (order.enabled === false || order.status === 'Deshabilitado') {
    return 'disabled'
  } else if (order.status === 'Pedido finalizado') {
    return 'completed'
  } else if (order.status === 'Pedido ordenado') {
    return 'queued'
  } else if (order.absent === true || order.status === 'Ausente') {
    return 'absent'
  } else if (order.menu_id && order.status === 'Sin pedido') {
    return 'standby'
  }
  return 'unknow'
}

me.getByDays = params => {
  return rp
    .get({
      uri: API_URI + '/get-orders',
      qs: {
        employee_id: params.employee_id,
        chef_pass: params.chef_pass,
        date_from: params.date_from,
        date_to: params.date_to
      },
      json: true
    })
    .then(response =>
      response.result.orders.map((data, key) => {
        const order = data
        order.absent = typeof order.absent === 'boolean' ? order.absent : Boolean(parseInt(order.absent))
        order.enabled = Boolean(order.enabled)
        order.status = getStatus(order)

        return order
      })
    )
}

me.getList = params => {
  return rp
    .get({
      uri: API_URI + '/get-orders-list',
      qs: {
        employee_id: params.employee_id,
        chef_pass: params.chef_pass,
        date_from: params.date_from,
        date_to: params.date_to
      },
      json: true
    })
    .then(response => response.result.orders)
}

me.get = params => {
  return rp
    .get({
      uri: API_URI + '/get-order',
      qs: {
        employee_id: params.employee_id,
        chef_pass: params.chef_pass,
        menu_id: params.menu_id,
        date: params.date
      },
      json: true
    })
    .then(response => {
      response.result.foods = response.result.foods.reduce((out, item) => {
        if (item.category_column) {
          out[item.category_column] = Object.keys(item.food_types).reduce((items, key) => {
            const foodTypes = item.food_types[key]
            if (Array.isArray(foodTypes)) {
              foodTypes.forEach(food => {
                items.push(food)
              })
              return items
            }
          }, [])
          return out
        }
      }, {})

      return response.result
    })
}

me.save = (params, data) => {
  return rp
    .get({
      uri: API_URI + '/make-order',
      qs: {
        employee_id: params.employee_id,
        chef_pass: params.chef_pass,
        order_id: data.order_id,
        menu_id: data.menu_id,
        date: data.date,
        absent: data.absent,
        plato_principal_id: data.plato_principal_id,
        postre_id: data.postre_id
      },
      json: true
    })
    .then(response => response && response.result)
}

module.exports = me
