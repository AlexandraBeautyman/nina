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

const mom = {
  streetaddress: '6012 Cricket Road, Flourtown, PA 19031',
  lat: 40.104895,
  lng: -75.2295606
}

router.get('/event', async (req, res, next) => {
  const name = req.body.eventName
  const eventDeets = await Event.findOne({
    where: {
      name
    }
  })
  console.log(eventDeets)
  res.send(eventDeets)
})

router.post('/input', async (req, res, next) => {
  const {firstName, lastName, email, address} = req.body.guestInfo
  const event = req.body.event
  try {
    const directions = await googleMapsClient
      .directions({
        origin: address,
        destination: event.streetaddress
      })
      .asPromise()
    const streetaddress = directions.json.routes[0].legs[0].start_address
    const lat = directions.json.routes[0].legs[0].start_location.lat
    const lng = directions.json.routes[0].legs[0].start_location.lng
    const duration = directions.json.routes[0].legs[0].duration.value
    const distance = directions.json.routes[0].legs[0].distance.value
    const newGuestEntry = await Address.create({
      firstName,
      lastName,
      email,
      streetaddress,
      lat,
      lng,
      duration,
      distance
    })
    res.send(newGuestEntry)
  } catch (error) {
    next(error)
  }
})

router.put('/origin', async (req, res, next) => {
  const originEmail = req.body.originEmail
  try {
    const origin = await Address.findOne({
      where: {
        email: originEmail
      }
    })
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
    for (let i = 0; i < origins.length; i++) {
      durationObject[origins[i].id] = originsDurations.json.rows[i].elements[0]
    }
    for (let i = 0; i < destinations.length; i++) {
      durationObject[destinations[i].id] =
        destinationsDurations.json.rows[0].elements[i]
    }
    res.send(durationObject)
  } catch (error) {
    next(error)
  }
})
