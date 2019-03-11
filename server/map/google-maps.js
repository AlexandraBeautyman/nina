// TODOS FOR THIS APP:
// DONE 0. Review presentation guidelines.
// DONE 1. Make the address input page.
// DONE SORT OF 2. Figure out Google unit of duration. (~ between 16 and 17 min is 1000)
// SKIP FOR NOW 3. Let user set acceptable out-of-the-way distance.
// 4. Clean up UI after submission of address.
// DONE 5. STYLE THIS SHIT!
// SKIP FOR NOW 6. Make the event selectable? Or at least stick it in the database instead of in the code?
// SKIP FOR NOW 7. Clean up this file and other files.
// SKIP FOR NOW 8. Move functions to where they belong (frontend?).
// DONE 9. Create dummy names and emails with addresses, and give those to user instead of actual addresses.
// DONE 10. If time, use dummy email to fetch data.
// DONE 10.5 Toast notifications!
// 11. Make presentation!

require('../../secrets')

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY
})

const apt32 = {lat: 41.318438, lng: -72.927927}
const momCoordinates = {lat: 40.104895, lng: -75.2295606}

const nhMomCoordinateBox = {
  top: 42.531981,
  bottom: 40.104895,
  left: -75.2295606,
  right: -70.6262934,
  width: 4.603267200000005,
  depth: 2.4270860000000027
}

const distanceNhMom = 10795

// googleMapsClient.directions({
//   origin: { lat: 41.318438, lng: -72.927927 },
//   destination: { lat: 40.104895, lng: -75.2295606 }
// },
// function(err, response) {
//   if (!err) {
//     console.log(response.json.routes[0].legs[0].duration.value)
//   }
// })

// googleMapsClient.geocode(
//   {
//     address: '130 Winchester Avenue, New Haven, CT 06511'
//   },
//   function (err, response) {
//     if (!err) {
//       console.log('apt32', response.json.results[0].geometry.location)
//     }
//   }
// )

// const A = { lat: 37.4216105, lng: -122.0835509 }
// const B = { lat: 40.8035383, lng: -73.95557629999999 }

// Helper functions

function makeCoordinateBox(origin, event) {
  const coordinateBox = {}
  coordinateBox.top = origin.lat + Math.abs(origin.lat - event.lat)
  coordinateBox.bottom = origin.lat - Math.abs(origin.lat - event.lat)
  coordinateBox.left = origin.lng - Math.abs(origin.lng - event.lng)
  coordinateBox.right = origin.lng + Math.abs(origin.lng - event.lng)
  coordinateBox.width = coordinateBox.right - coordinateBox.left
  coordinateBox.depth = coordinateBox.top - coordinateBox.bottom
  return coordinateBox
}

//console.log('coordinate box', makeCoordinateBox(apt32, momCoordinates))

// googleMapsClient.directions(
//   {
//     origin: { lat: 37.4216105, lng: -122.0835509 },
//     destination: { lat: 40.8035383, lng: -73.95557629999999 }
//   },
//   function (err, response) {
//     if (!err) {
//       console.log(response.json.routes[0].legs[0].duration.value)
//     }
//   }
// )

// googleMapsClient.geocode(
//   {
//     address: '282 W 115th Street, New York, NY'
//   },
//   function(err, response) {
//     if (!err) {
//       console.log(response.json.results[0].geometry.location)
//     }
//   }
// )

module.exports = {
  makeCoordinateBox
}
