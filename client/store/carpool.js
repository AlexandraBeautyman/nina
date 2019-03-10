import axios from 'axios'

// HELPER FUNCTION
function compareByDistance(a, b) {
  if (a.distanceSquared < b.distanceSquared) {
    return -1
  }
  if (a.distanceSquared > b.distanceSquared) {
    return 1
  }
  return 0
}

// ACTION TYPES
const GOT_ORIGIN = 'GOT_ORIGIN'
const GOT_BUDDIES = 'GOT_BUDDIES'
const GOT_FILTERED_BUDDIES = 'GOT_FILTERED_BUDDIES'

// ACTION CREATORS
const gotOrigin = origin => ({
  type: GOT_ORIGIN,
  origin
})

const gotBuddies = buddies => ({
  type: GOT_BUDDIES,
  buddies
})

const gotFilteredBuddies = filteredBuddies => ({
  type: GOT_FILTERED_BUDDIES,
  filteredBuddies
})

// THUNK CREATORS
export const setOrigin = originAddress => async dispatch => {
  try {
    const {data} = await axios.put('/map/origin', {originAddress})
    console.log('data', data)
    dispatch(gotOrigin(data))
  } catch (error) {
    console.log(error)
  }
}

export const getBuddies = (coordinateBox, origin) => async dispatch => {
  try {
    const {data} = await axios.put('/map/carpool', {coordinateBox})
    let shortlist
    if (data.length > 20) {
      data.forEach(datum => {
        const distanceSquared =
          Math.pow(Math.abs(origin.lat - datum.lat), 2) +
          Math.pow(Math.abs(origin.lng - datum.lng), 2)
        datum.distanceSquared = distanceSquared
      })
      data.sort(compareByDistance)
      shortlist = data.slice(0, 20)
    } else {
      shortlist = data
    }
    dispatch(gotBuddies(shortlist))
  } catch (error) {
    console.error(error)
  }
}

export const filterBuddies = (potentials, origin) => async dispatch => {
  const maxDuration = 100 // store this on state (LATER)
  const durationOriginEvent = origin.duration
  const potentialsObject = {}
  for (let i = 0; i < potentials.length; i++) {
    potentialsObject[potentials[i].id] = potentials[i]
  }
  try {
    const {data} = await axios.post('/map/buddies', {potentials, origin})
    const keepers = []
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        const extraDuration =
          data[key].duration.value +
          potentialsObject[key].duration -
          durationOriginEvent
        if (extraDuration < maxDuration) {
          keepers.push(potentialsObject[key])
        }
      }
    }
    dispatch(gotFilteredBuddies(keepers))
  } catch (error) {
    console.error(error)
  }
}

// INITIAL STATE
const initialState = {
  buddies: [],
  filteredBuddies: [],
  origin: {}
}

// REDUCER
export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_BUDDIES:
      return {...state, buddies: action.buddies}
    case GOT_FILTERED_BUDDIES:
      return {...state, filteredBuddies: action.filteredBuddies}
    case GOT_ORIGIN:
      return {...state, origin: action.origin}
    default:
      return state
  }
}
