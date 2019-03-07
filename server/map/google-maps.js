const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY
})

googleMapsClient.geocode(
  {
    address: '1600 Amphitheatre Parkway, Mountain View, CA'
  },
  function(err, response) {
    if (!err) {
      console.log(response.json.results)
    }
  }
)
