import { bindActionCreators } from 'redux'
import {csrfFetch} from './csrf'


const LOAD_SPOTS = 'spots/getSpot'
const CREATE_SPOT = 'spots/createSpot'
const UPDATE_SPOT = 'spots/updateSpot'
const LOAD_ONESPOT = 'spots/getSpotById'
const DELETE_SPOT = 'spot/deleteSpot'
const LOAD_CURRENT = 'spots/current'
const LOAD_FAVORITES = 'spots/favorites'
const CREATE_PREVIEWIMAGE = 'spots/postPreviewImage'
const CREATE_SPOTIMAGE = 'spots/postSpotImage'


const actionLoad = spot => ({
    type: LOAD_SPOTS,
    spot
})

const actionLoadCurrent = spot => ({
    type: LOAD_CURRENT,
    spot
})

const actionCreateOneSpot = spot => ({
    type: CREATE_SPOT,
    spot
})

const actionUpdateOneSpot = spot => ({
    type: UPDATE_SPOT,
    spot,
})

const actionGetOneSpot = spot => ({
    type: LOAD_ONESPOT,
    spot
})

const actionDeleteOneSpot = (spot) => ({
    type: DELETE_SPOT,
    spot
})

const actionLoadFavorite = spot => ({
    type: LOAD_FAVORITES,
    spot
})

const actionCreatePreviewImage = (spotId, url, preview) => ({
    type: CREATE_PREVIEWIMAGE,
    spotId,
    url,
    preview
})

const actionCreateSpotImage = (spotId, url, preview) => ({
    type: CREATE_SPOTIMAGE,
    spotId,
    url,
    preview
})


export const getSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots')
    if (response.ok) {
        const spots = await response.json()
        dispatch(actionLoad(spots))
        return spots
    }
}

export const currentSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots/current')
    if (response.ok) {
        const currentSpots = await response.json()
        dispatch(actionLoadCurrent(currentSpots))
        return currentSpots
    }
}

export const favoriteSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots/favorites')
    if (response.ok) {
        const favoriteSpots = await response.json()
        dispatch(actionLoadFavorite(favoriteSpots))
        return favoriteSpots
    }
}

export const createSpot = spot => async dispatch => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spot)
    })
    if (response.ok) {
        const spot = await response.json()
        dispatch(actionCreateOneSpot(spot))
        return spot
    }
}

export const updateSpot = (payload, Owner, SpotImages) => async (dispatch) => {
    const {address, city, country, createdAt, description, id, lat, lng, name, ownerId, price, state, updatedAt, favorites} = payload
    const response = await csrfFetch(`/api/spots/${payload.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    if (response.ok) {
        const spot = await response.json()
        dispatch(actionUpdateOneSpot({
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
            updatedAt: updatedAt,
        }))
        return spot
    }
}

export const getSpotById = id => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}`)
    if (response.ok) {
        const spot = await response.json()
        dispatch(actionGetOneSpot(spot))
        return spot
    }
}

export const deleteSpot = id => async dispatch => {
    const response = await csrfFetch(`/api/spots/${Number(id)}`, {
        method: 'DELETE',
    })
    
    if (response.ok) {
        const deletedSpot = await response.json()
        dispatch(actionDeleteOneSpot(id))
        
        return deletedSpot
    }
}

export const createPreviewImage = (spotId, url, preview) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url,
            preview
        })
    })
    if (response.ok) {
        const {spotId, url, preview} = await (response.json())
        dispatch(actionCreatePreviewImage(+spotId, url, preview))
        return spotId
    }
}

export const createSpotImage = (spotId, url, preview) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url, 
            preview
        })
    })
    if (response.ok) {
        const {spotId, url, preview} = await (response.json())
        dispatch(actionCreateSpotImage(+spotId, url, preview))
        return spotId
    }
}



const initialState = {}

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
        case LOAD_FAVORITES: 
            newState = []
            action.spot.Spots.forEach(spot => {
                newState[spot.id] = spot 
            })
            return newState
        case CREATE_SPOT: 
            newState = Object.assign({}, state)
            newState[action.spot.id] = action.spot
            return newState
        case UPDATE_SPOT: 
            
            newState = Object.assign({}, state)
            newState[action.spot.id] = action.spot
            return newState
        case LOAD_ONESPOT:
            newState = Object.assign({}, state)
            newState[action.spot.id]= action.spot
            return newState
        case DELETE_SPOT: 
            newState = Object.assign({}, state)
            delete newState[action.spot]
            return newState
        case CREATE_PREVIEWIMAGE: 
            newState = Object.assign({}, state)
            newState = {...state, [action.spotId.previewImage]: action.url}
            return newState
        case CREATE_SPOTIMAGE:
            newState = Object.assign({}, state)
            newState = {...state, [action.spotId.SpotImages]: [action.spotId.SpotImages].push(action.url)}
            return newState
    default: 
        return state 
    }
}






