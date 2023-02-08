import {csrfFetch} from './csrf'

//! Const Variables
const GET_ALL_SPOTS = 'spots/getSpot'
const CREATE_SPOT = 'spots/createSpot'
const UPDATE_SPOT = 'spots/updateSpot'
const GET_ONE_SPOT = 'spots/getSpotById'
const DELETE_SPOT = 'spot/deleteSpot'
const GET_CURRENT_USER_SPOTS = 'spots/current'
const GET_ALL_FAVORITE_SPOTS = 'spots/getAllFavorites'
const CREATE_PREVIEWIMAGE = 'spots/postPreviewImage'
const CREATE_SPOTIMAGE = 'spots/postSpotImage'


//! Action Variables on the initial Value
const actionGetAllSpots = spot => ({
    type: GET_ALL_SPOTS,
    spot
})

const actionGetAllCurrentUserSpots = spot => ({
    type: GET_CURRENT_USER_SPOTS,
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

const actionSpotById = spot => ({
    type: GET_ONE_SPOT,
    spot
})

const actionDeleteOneSpot = (spot) => ({
    type: DELETE_SPOT,
    spot
})

const actionGetAllFavoriteSpots = favorite => ({
    type: GET_ALL_FAVORITE_SPOTS,
    favorite
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
        dispatch(actionGetAllSpots(spots))
        return spots
    }
}



export const currentSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots/current')
    if (response.ok) {
        const currentSpots = await response.json()
        dispatch(actionGetAllCurrentUserSpots(currentSpots))
        return currentSpots
    }
}

export const thunkGetFavoriteSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots/favorites')
    if (response.ok) {
        const favoriteSpots = await response.json()
        dispatch(actionGetAllFavoriteSpots(favoriteSpots))
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
        dispatch(actionSpotById(spot))
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



const initialState = {
    allSpots: {},
    singleSpot: {}
}

const normalize = (spots) => {
    const data = {}
    if (spots.Spots) {
        spots.Spots.forEach(spot => data[spot.id] = spot)
        return data
    }
}

export default function spotsReducer(state = initialState, action) {
    let newState
    switch(action.type) {
        case GET_ALL_SPOTS: {
            const newState = {...state} 
            newState.allSpots = normalize(action.spot)
            return newState
        }

        case GET_CURRENT_USER_SPOTS: {
            const newState = {...state}
            newState.allSpots = normalize(action.spot)
            return newState
        }

        case GET_ALL_FAVORITE_SPOTS: {
            const newState = {...state}
            newState.allSpots = normalize(action.favorite)
            return newState
        }

        case GET_ONE_SPOT: {
            const newState = {...state}
            newState.singleSpot = action.spot
            return newState
        }

        case CREATE_SPOT: {
            const newState = {...state} 
            newState.allSpots = {...state.allSpots, [action.spot.id]: action.spot}
            return newState
        }

        case UPDATE_SPOT: {
            const newState = {...state}
            newState.allSpots = {...state.allSpots, [action.spot.id]: action.spot}
            newState.singleSpot = {...state.singleSpot, ...action.spot}
            return newState
        }

        case DELETE_SPOT: {
            const newState = {...state}
            delete newState.allSpots[action.spot]
            return newState
        }

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






