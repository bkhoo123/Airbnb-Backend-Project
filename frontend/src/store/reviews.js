import {csrfFetch} from './csrf'

const READ_SPOTREVIEWS = 'reviews/getSpotReviews'
const CREATE_SPOTREVIEW = 'review/createSpotReview'
const DELETE_SPOTREVIEW = 'review/deleteSpotReview'
const EDIT_SPOTREVIEW = 'review/editSpotReview'

const actionLoadSpotReview = review => ({
    type: READ_SPOTREVIEWS,
    review
})

const actionCreateReview = review => ({
    type: CREATE_SPOTREVIEW,
    review
})

const actionDeleteReview = review => ({
    type: DELETE_SPOTREVIEW,
    review
})

const actionEditReview = review => ({
    type: EDIT_SPOTREVIEW,
    review
})


export const getSpotReviews = id => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}/reviews`)
    if (response.ok) {
        const spotReviews = await response.json()
        dispatch(actionLoadSpotReview(spotReviews))
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
        dispatch(actionCreateReview(spotReview))
        return spotReview
    }
}

export const thunkEditSpotReview = review => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
    })
    if (response.ok) {
        const editReview = await response.json()
        dispatch(actionEditReview(editReview))
        return editReview
    }
}

export const deleteSpotReview = id => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${id}`, {
        method: 'DELETE',
    })
    if (response.ok) {
        const deletedReview = await response.json()
        dispatch(actionDeleteReview(id))
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
            newState[action.review.id] = action.review
            newState[action.review.id].User = {id: action.review.userId} 
            return newState
        case EDIT_SPOTREVIEW: 
            newState = Object.assign({}, state) 
            newState[action.review.id] = action.review
            newState[action.review.id].User = {id: action.review.userId} 
            return newState
        case DELETE_SPOTREVIEW:
            newState = Object.assign({}, state)
            delete newState[action.review]
            return newState
    default:
        return state
    }
}