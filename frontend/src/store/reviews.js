import {csrfFetch} from './csrf'

const READ_SPOTREVIEWS = 'spots/getSpotReviews'
const CREATE_SPOTREVIEW = 'spots/createSpotReview'
const DELETE_SPOTREVIEW = 'spots/deleteSpotReview'

const loadSpotReview = review => ({
    type: READ_SPOTREVIEWS,
    review
})

const createReview = spot => ({
    type: CREATE_SPOTREVIEW,
    spot
})

const deleteReview = spot => ({
    type: DELETE_SPOTREVIEW,
    spot
})


export const getSpotReviews = id => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}/reviews`)
    if (response.ok) {
        const spotReviews = await response.json()
        dispatch(loadSpotReview(spotReviews))
        return spotReviews
    }
}

export const createSpotReview = spot => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spot.spotId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spot)
    })
    if (response.ok) {
        const spotReview = await response.json()
        dispatch(createReview(spotReview))
        return spotReview
    }
}

export const deleteSpotReview = id => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${id}`, {
        method: 'DELETE',
    })
    if (response.ok) {
        const deletedReview = await response.json()
        dispatch(deleteReview(id))
        return deletedReview
    }
}

const initialState = {}

export default function reviewsReducer(state = initialState, action) {
    let newState
    switch(action.type) {
        case READ_SPOTREVIEWS:
            newState = {}
            action.review.Reviews.forEach(review => {
                newState[review.id] = review
            })
            return newState
        case CREATE_SPOTREVIEW:
            newState = Object.assign({}, state)
            newState[action.spot.id] = action.spot
            newState[action.spot.id].User = {id: action.spot.userId} 
            return newState
        case DELETE_SPOTREVIEW:
            newState = Object.assign({}, state)
            delete newState[action.spot]
            return newState
    default:
        return state
    }
}