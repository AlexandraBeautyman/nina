const Sequelize = require('sequelize')
const db = require('../db')

const Event = db.define('event', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lat: {
    type: Sequelize.FLOAT(10, 6),
    allowNull: false
  },
  lng: {
    type: Sequelize.FLOAT(10, 6),
    allowNull: false
  },
  streetaddress: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Event
