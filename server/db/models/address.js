const Sequelize = require('sequelize')
const db = require('../db')

const Address = db.define('address', {
  //   email: {
  //     type: Sequelize.STRING,
  //     unique: true,
  //     allowNull: false
  //   },
  vid: {
    type: Sequelize.STRING
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
  },
  distance: {
    type: Sequelize.INTEGER
  },
  duration: {
    type: Sequelize.INTEGER
  }
})

module.exports = Address
