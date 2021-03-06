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
const GOT_ERROR = 'GOT_ERROR'

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

const gotError = error => ({
  type: GOT_ERROR,
  error
})

// THUNK CREATORS
export const setOrigin = originEmail => async dispatch => {
  try {
    const {data} = await axios.put('/map/origin', {originEmail})
    dispatch(gotOrigin(data))
  } catch (error) {
    console.error(error)
  }
}

export const getBuddies = (coordinateBox, origin) => async dispatch => {
  try {
    const {data} = await axios.put('/map/carpool', {coordinateBox})
    let shortlist = data.filter(datum => datum.id !== origin.id)
    if (shortlist.length > 20) {
      shortlist.forEach(item => {
        const distanceSquared =
          Math.pow(Math.abs(origin.lat - item.lat), 2) +
          Math.pow(Math.abs(origin.lng - item.lng), 2)
        item.distanceSquared = distanceSquared
      })
      shortlist.sort(compareByDistance)
      shortlist = shortlist.slice(0, 20)
    }
    dispatch(gotBuddies(shortlist))
  } catch (error) {
    console.error(error)
  }
}

export const filterBuddies = (potentials, origin) => async dispatch => {
  const maxDuration = 1000 // store this on state (LATER. 1000 is ~ between 16 and 17 min away)
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
    dispatch(gotError(error))
    console.error(error)
  }
}

// INITIAL STATE
const initialState = {
  buddies: [],
  filteredBuddies: [],
  origin: {},
  error: false
}

// REDUCER
export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_BUDDIES:
      return {...state, buddies: action.buddies, error: false}
    case GOT_FILTERED_BUDDIES:
      return {...state, filteredBuddies: action.filteredBuddies, error: false}
    case GOT_ORIGIN:
      return {...state, origin: action.origin, error: false}
    case GOT_ERROR:
      return {...state, error: action.error}
    default:
      return state
  }
}
