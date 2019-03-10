const router = require('express').Router()
const Address = require('../db/models/address')
const {makeCoordinateBox} = require('./google-maps')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
module.exports = router

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
})

const momCoordinates = {lat: 40.104895, lng: -75.2295606}

// const A = { lat: 37.4216105, lng: -122.0835509 }
// const B = { lat: 40.8035383, lng: -73.95557629999999 }

// const sampleCoordinateBox = makeCoordinateBox(A, B)

router.put('/origin', async (req, res, next) => {
  const originAddress = req.body.originAddress
  console.log('originAddress: ', originAddress)
  try {
    const origin = await Address.findOne({
      where: {
        streetaddress: originAddress
      }
    })
    console.log('origin', origin)
    res.send(origin)
  } catch (error) {
    next(error)
  }
})

router.put('/carpool', async (req, res, next) => {
  const coordinateBox = req.body.coordinateBox
  try {
    let neighbors = await Address.findAll({
      where: {
        lat: {
          [Op.gt]: coordinateBox.bottom,
          [Op.lt]: coordinateBox.top
        },
        lng: {
          [Op.gt]: coordinateBox.left,
          [Op.lt]: coordinateBox.right
        }
      }
    })
    res.send(neighbors)
  } catch (error) {
    next(error)
  }
})

router.post('/buddies', async (req, res, next) => {
  //const durationOriginEvent = 10795
  const origin = req.body.origin
  const durationOriginEvent = origin.duration
  const potentials = req.body.potentials
  const origins = []
  const destinations = []
  const durationObject = {}
  potentials.forEach(potential => {
    if (durationOriginEvent > potential.duration) {
      destinations.push(potential)
    } else {
      origins.push(potential)
    }
  })
  try {
    const originsDurations = await googleMapsClient
      .distanceMatrix({
        origins,
        destinations: [{lat: origin.lat, lng: origin.lng}]
      })
      .asPromise()
    const destinationsDurations = await googleMapsClient
      .distanceMatrix({
        origins: [{lat: origin.lat, lng: origin.lng}],
        destinations
      })
      .asPromise()
    // [0].elements[0].duration.value
    //console.log('destinationsDurations', destinationsDurations.json.rows[0].elements)
    //console.log('originsDurations', originsDurations.json)
    for (let i = 0; i < origins.length; i++) {
      durationObject[origins[i].id] = originsDurations.json.rows[i].elements[0]
    }
    for (let i = 0; i < destinations.length; i++) {
      durationObject[destinations[i].id] =
        destinationsDurations.json.rows[0].elements[i]
    }
    //console.log(durationObject)
    res.send(durationObject)
  } catch (error) {
    next(error)
  }
})

// const fetchAddresses = async (origin, event) => {
//     //const arrayOfCoordinateBoxes = []
//     try {
//         const coordinateBox = makeCoordinateBox(origin, event)
//         const addresses = await axios.get('/map/address', {coordinateBox})
//         console.log(addresses)
//     }
//     catch (error) {
//         console.log(error)
//     }
// }

// fetchAddresses(A, B)
