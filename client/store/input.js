import axios from 'axios'

// ACTION TYPES
const ADDED_GUEST = 'ADDED_GUEST'
const SELECTED_EVENT = 'SELECTED_EVENT'

// ACTION CREATORS
const addedGuest = guest => ({
  type: ADDED_GUEST,
  guest
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
  eventDeets: {}
}

// REDUCER
export default function(state = initialState, action) {
  switch (action.type) {
    case ADDED_GUEST:
      return {...state, guest: action.guest}
    case SELECTED_EVENT:
      return {...state, eventDeets: action.eventDeets}
    default:
      return state
  }
}
