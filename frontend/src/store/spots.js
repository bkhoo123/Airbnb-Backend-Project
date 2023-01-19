import { bindActionCreators } from 'redux'
import {csrfFetch} from './csrf'


const LOAD_SPOTS = 'spots/getSpot'
const CREATE_SPOT = 'spots/createSpot'
const UPDATE_SPOT = 'spots/updateSpot'
const LOAD_ONESPOT = 'spots/getSpotById'
const DELETE_SPOT = 'spot/deleteSpot'
const LOAD_CURRENT = 'spots/current'


const load = spot => ({
    type: LOAD_SPOTS,
    spot
})

const loadCurrent = spot => ({
    type: LOAD_CURRENT,
    spot
})

const createOneSpot = spot => ({
    type: CREATE_SPOT,
    spot
})

const updateOneSpot = spot => ({
    type: UPDATE_SPOT,
    spot,
})

const getOneSpot = spot => ({
    type: LOAD_ONESPOT,
    spot
})

const deleteOneSpot = (spot) => ({
    type: DELETE_SPOT,
    spot
})




export const getSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots')
    if (response.ok) {
        const spots = await response.json()
        dispatch(load(spots))
        return spots
    }
}

export const currentSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots/current')
    if (response.ok) {
        const currentSpots = await response.json()
        dispatch(loadCurrent(currentSpots))
        return currentSpots
    }
}

export const createSpot = spot => async dispatch => {
    console.log('incoming createSpot variable', spot)
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spot)
    })
    if (response.ok) {
        const spot = await response.json()
        dispatch(createOneSpot(spot))
        return spot
    }
}

export const updateSpot = (payload, Owner, SpotImages) => async (dispatch) => {
    const {address, city, country, createdAt, description, id, lat, lng, name, ownerId, price, state, updatedAt} = payload
    const response = await csrfFetch(`/api/spots/${payload.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    if (response.ok) {
        const spot = await response.json()
        dispatch(updateOneSpot({
            Owner: Owner,
            SpotImages: SpotImages,
            address: address,
            city: city,
            country: country,
            createdAt: createdAt,
            description: description,
            id: id,
            lat: lat,
            lng: lng,
            name: name,
            ownerId: ownerId,
            price: price, 
            state: state,
            updatedAt: updatedAt
        }))
        return spot
    }
}

export const getSpotById = id => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}`)
    if (response.ok) {
        const spot = await response.json()
        dispatch(getOneSpot(spot))
        return spot
    }
}

export const deleteSpot = id => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}`, {
        method: 'DELETE',
    })
    
    if (response.ok) {
        const deletedSpot = await response.json()
        dispatch(deleteOneSpot(id))
        
        return deletedSpot
    }
}



const initialState = {
    
}




export default function spotsReducer(state = initialState, action) {
    let newState
    switch(action.type) {
        case LOAD_SPOTS:
            newState = Object.assign({}, state)
            action.spot.Spots.forEach(spot => {
                newState[spot.id] = spot
            })
            return newState
        case LOAD_CURRENT: 
            newState = {}
            action.spot.Spots.forEach(spot => {
                newState[spot.id] = spot
            })
            return newState
        case CREATE_SPOT: 
            newState = Object.assign({}, state)
            newState[action.spot.id] = action.spot
            return newState
        case UPDATE_SPOT: 
            console.log(action.spot, 'actionupdateSPot')
            newState = Object.assign({}, state)
            newState[action.spot.id] = action.spot
            return newState
        case LOAD_ONESPOT:
            newState = Object.assign({}, state)
            newState[action.spot.id] = action.spot
            
            return newState
        case DELETE_SPOT: 
            newState = Object.assign({}, state)
            delete newState[action.spot]
            return newState
        
    default: 
        return state 
    }
}






