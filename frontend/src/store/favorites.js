import {csrfFetch} from './csrf'


const GET_CURRENT_USER_FAVORITES = 'favorite/currentUserFavorites'
const CREATE_SPOT_FAVORITE = 'favorite/createSpotFavorite'
const DELETE_SPOT_FAVORITE = 'favorite/deleteSpotFavorite'


const actionGetAllFavoritesByUser = favorite => ({
    type: GET_CURRENT_USER_FAVORITES,
    favorite
})

const actionCreateSpotFavorite = favorite => ({
    type: CREATE_SPOT_FAVORITE,
    favorite
})

const actionDeleteSpotFavorite = favorite => ({
    type: DELETE_SPOT_FAVORITE,
    favorite
})




export const thunkCurrentFavoriteSpots = () => async dispatch => {
    const response = await csrfFetch('/api/favorites/current')
    if (response.ok) {
        const favoriteSpots = await response.json()
        dispatch(actionGetAllFavoritesByUser(favoriteSpots))
        return favoriteSpots
    }
}


export const thunkCreateSpotFavorite = spot => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spot.id}/favorites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spot)
    })
    if (response.ok) {
        const favoriteSpot = await response.json()
        dispatch(actionCreateSpotFavorite(favoriteSpot))
        return favoriteSpot
    }
}

export const thunkDeleteSpotFavorite = id => async dispatch => {
    const response = await csrfFetch(`/api/favorites/${id}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        const deletedFavoriteSpot = await response.json()
        dispatch(actionDeleteSpotFavorite(id))
        return deletedFavoriteSpot
    }
}



const initialState = {}


export default function favoritesReducer(state = initialState, action) {
    switch(action.type) {
        case GET_CURRENT_USER_FAVORITES: {
            const newState = Object.assign({}, state)
            action.favorite.favorites.forEach(favorite => {
                newState[favorite.id] = favorite
            })
            return newState
        }
        
        case CREATE_SPOT_FAVORITE: {
            const newState = {...state}
            newState[action.favorite.id] = action.favorite
            return newState
        }

        case DELETE_SPOT_FAVORITE: {
            const newState = {...state}
            delete newState[action.favorite]
            return newState
        }
        default: 
            return state
    }
}
