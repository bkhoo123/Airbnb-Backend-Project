import {csrfFetch} from './csrf'

const GET_ALL_BOOKING_SPOTID = 'bookings/GET_ALL_BOOKINGS';
const GET_CURRENT_USER_BOOKINGS = 'bookings/GET_CURRENT_BOOKINGS'
const POST_BOOKING = 'bookings/POST_BOOKING'
const EDIT_BOOKING = 'bookings/EDIT_BOOKING'
const DELETE_BOOKING = 'bookings/DELETE_BOOKING'


const actionCurrentUserBooking = bookings => ({
    type: GET_CURRENT_USER_BOOKINGS,
    bookings
})

const actionGetBookingBySpotId = bookings => ({
    type: GET_ALL_BOOKING_SPOTID,
    bookings
}) 

const actionCreateBooking = booking => ({
    type: POST_BOOKING,
    booking
})

const actionEditBooking = booking => ({
    type: EDIT_BOOKING,
    booking
})

const actionDeleteBooking = booking => ({
    type: DELETE_BOOKING,
    booking
})



export const thunkCurrentUserBookings = () => async dispatch => {
    const response = await csrfFetch(`/api/bookings/current`)
    if (response.ok) {
        const bookings = await response.json()
        dispatch(actionCurrentUserBooking(bookings))
        return bookings
    }
}


//? By Spot Id
export const thunkGetAllBookings = id => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}/bookings`)
    if (response.ok) {
        const bookings = await response.json()
        dispatch(actionGetBookingBySpotId(bookings))
        return bookings
    }
}

export const thunkCreateBooking = spot => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spot.id}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spot)
    })
    if (response.ok) {
        const createdBooking = await response.json()
        dispatch(actionCreateBooking(createdBooking))
        return createdBooking
    }
}

export const thunkEditBooking = booking => async dispatch => {
    const response = await csrfFetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(booking)
    })
    if (response.ok) {
        const editedBooking = await response.json()
        dispatch(actionEditBooking(editedBooking))
        return editedBooking
    }
}

export const thunkDeleteBooking = id => async dispatch => {
    const response = await csrfFetch(`/api/bookings/${id}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        
        const deletedBooking = await response.json()
        dispatch(actionDeleteBooking(id))
        return deletedBooking
    }
}


const initialState = {
    userBookings: {},
    bookingsById: {}
}

const normalize = (bookings) => {
    const data = {}
    if (bookings.Bookings) {
        bookings.Bookings.forEach(booking => data[booking.id] = booking)
        return data
    }
}

export default function bookingsReducer(state = initialState, action) {
    switch(action.type) {
        case GET_CURRENT_USER_BOOKINGS: {
            const newState = {...state}
            newState.userBookings = normalize(action.bookings)
            return newState
        }    
        case GET_ALL_BOOKING_SPOTID: {
            const newState = {...state}
            newState.bookingsById = normalize(action.bookings)
            return newState
        }    
        case POST_BOOKING: {
            const newState = Object.assign({}, state)
            newState.userBookings = {...state.userBookings, [action.booking.id]: action.booking}
            newState.bookingsById = {...state.bookingsById, [action.booking.id]: action.booking}
            return newState
        }
        case EDIT_BOOKING: {
            const newState = Object.assign({}, state)
            newState.userBookings = {...state.userBookings, [action.booking.id]: action.booking}
            newState.bookingsById = {...state.bookingsById, [action.booking.id]: action.booking}
            return newState
        } 
        case DELETE_BOOKING: {
            const newState = Object.assign({}, state)
            delete newState.userBookings[action.booking]
            delete newState.bookingsById[action.booking]
            return newState
        }            
    default: 
        return state
    }
}

