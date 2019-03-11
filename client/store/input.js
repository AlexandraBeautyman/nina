import axios from 'axios'

// ACTION TYPES
const ADDED_GUEST = 'ADDED_GUEST'
const GOT_ERROR = 'GOT_ERROR'
const SELECTED_EVENT = 'SELECTED_EVENT'

// ACTION CREATORS
const addedGuest = guest => ({
  type: ADDED_GUEST,
  guest
})

const gotError = error => ({
  type: GOT_ERROR,
  error
})

const selectedEvent = eventDeets => ({
  type: SELECTED_EVENT,
  eventDeets
})

//THUNK CREATORS
export const addGuest = (guestInfo, event) => async dispatch => {
  try {
    const {data} = await axios.post('/map/input', {guestInfo, event})
    dispatch(addedGuest(data))
  } catch (error) {
    dispatch(gotError(error))
    console.error(error)
  }
}

export const selectEvent = eventName => async dispatch => {
  try {
    const {data} = await axios.get('/map/event', {eventName})
    dispatch(selectedEvent(data))
  } catch (error) {
    console.error(error)
  }
}

// INITIAL STATE
const initialState = {
  guest: {},
  eventDeets: {},
  error: false
}

// REDUCER
export default function(state = initialState, action) {
  switch (action.type) {
    case ADDED_GUEST:
      return {...state, guest: action.guest, error: false}
    case GOT_ERROR:
      return {...state, error: true}
    case SELECTED_EVENT:
      return {...state, eventDeets: action.eventDeets, error: false}
    default:
      return state
  }
}
