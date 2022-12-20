const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');

const {User, Spot, SpotImage, Review, Booking, ReviewImage, sequelize} = require('../../db/models')

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth')

const {Op} = require("sequelize")



//! Get All Spots
//? Avg Rating Needs fine tuning 
//? previewImage Done December 20, 2022
//? Completed: Seed Data, Successful response, Spot Data includes all data 
router.get('/', async (req, res, next) => {
    let spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    })

    let spotsList = []
    spots.forEach((spot) => {
        spotsList.push(spot.toJSON())
    }) 
    
    spotsList.forEach(spot => {
        spot.Reviews.forEach(review => {
            spot.avgRating = review.stars
        })
        if (!spot.avgRating) {
            spot.avgRating = 'No reviews have been posted for this location'
        }

        delete spot.Reviews

        spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                spot.previewImage = image.url
            }
            if (!image.preview) {
                spot.previewImage = 'no image available'
            }
        })
        delete spot.SpotImages
    })

    res.status(200)
    return res.json({
        Spots: spotsList
    })
    
})


//! Get All Spots Owned by the Current User
//? An authenticated user is required for a successful response
//? Successful response includes only spots created by the current user
//Todo Bug Check: user past 4 
router.get('/current', requireAuth, async(req, res, next) => {
    let currentUser = req.user.id
    let spot = await Spot.findOne({
        where: {
            ownerId: currentUser
        },
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    })

    let avgRating = await Review.findOne({
        where: {
            userId: currentUser
        },
        attributes: [
            [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
        ]
    })
    let avg = avgRating.toJSON()
    
    

    let spots = spot.toJSON()
    spots.avgRating = avg.avgRating
    if (!avg.avgRating) {
        spots.avgRating = 'No reviews have been made for this location'
    }

    spots.SpotImages.forEach(image => {
        if (image.preview === true) {
            spots.previewImage = image.url
        }
        if (!image.preview || image.preview === false) {
            spots.previewImage = 'no image available'
        }
    })
    delete spots.SpotImages
    delete spots.Reviews

   
    res.status(200)
    return res.json({
        Spots: spots
    })
})


//! Get details of a Spot from an id 
router.get('/:spotId', async (req, res, next) => {
    let spotId = req.params.spotId

    let spotDetails = await Spot.findByPk(spotId, {
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    })

    if (!spotDetails) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    let avgRating = await Review.findOne({
        where: {
            spotId: spotId
        },
        attributes: [
            [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
        ]
    })
    let avg = avgRating.toJSON()

    let spots = spotDetails.toJSON()
    spots.avgRating = avg.avgRating
    if (!avg.avgRating) {
        spots.avgRating = 'No reviews have been made for this location'
    }

    spots.SpotImages.forEach(image => {
        if (image.preview === true) {
            spots.previewImage = image.url
        }
        if (!image.preview || image.preview === false) {
            spots.previewImage = 'no image available'
        }
    })
    delete spots.SpotImages
    delete spots.Reviews
    
    res.status(200)
    return res.json(spots)
})


//! Create a spot
router.post('/', requireAuth, handleValidationErrors, async (req, res, next) => {
    const {address, city, state, country, lat, lng, name, description, price} = req.body

    try {
        let newSpot = await Spot.create({
            ownerId: req.user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
        res.status(201)
        return res.json(newSpot)

    } catch (error) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                address: "Street address is required",
                city: "City is required",
                state: "State is required",
                country: "Country is required",
                lat: "Latitude is not valid",
                lng: "Longitude is not valid",
                name: "Name must be less than 50 characters",
                description: "Description is required",
                price: "Price per day is required"
            }
        })
    }
})

//! Add an Image to a Spot based on the Spot's id
//? Need to check if im blocking a person if its not their spot
//TODO Double check functionality
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    let spotId = req.params.spotId
    let userId = req.user.id

    if (!spotId) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    let spotUser = await Spot.findByPk(spotId)
    let spotUserJson = spotUser.toJSON()
    
    let ownerId = spotUserJson.ownerId

    if (ownerId !== userId) {
        res.status(404)
        return res.json({
            message: "Only the owner is authorized to add an image"
        })
    }

    const {url, preview} = req.body

    try {
        spotImage = await SpotImage.create({
            spotId: spotId,
            url,
            preview
        }, {
            include: [Spot]
        })
        res.status(200)
        return res.json({
            spotId,
            url,
            preview
        })
    } catch (error) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
})


//! Edit a Spot
router.put('/:spotId', requireAuth, handleValidationErrors, async (req, res, next) => {
    let spotId = req.params.spotId
    let userId = req.user.id

    let updatedSpot = await Spot.findByPk(spotId)

    //? Confirmed Functioning
    if (!updatedSpot) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    
    //? Confirmed Functioning
    let spotUser = await Spot.findByPk(spotId)
    let spotUserJson = spotUser.toJSON()
    
    
    let ownerId = spotUserJson.ownerId

    if (ownerId !== userId) {
        res.status(404)
        return res.json({
            message: "Only the owner is authorized to update the spot"
        })
    }

    //? Confirmed Functioning and Validation errors are functioning
    const {address, city, state, country, lat, lng, name, description, price} = req.body    

    updatedSpot.set({
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
    })
    try {
        await updatedSpot.save()
        res.status(200)
        return res.json(updatedSpot)
    } catch (error) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                address: "Stress address is required",
                city: "City is required",
                state: " State is required",
                country: " Country is required",
                lat: "Latitude is not valid",
                lng: "Longitude is not valid",
                name: "Name must be less than 50 characters",
                description: "Description is required",
                price: "Price per day is required"
            }
        })
    }
})

//! Delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    let spotId = req.params.spotId
    let userId = req.user.id

    let deleteSpot = await Spot.findByPk(spotId)

    if (!deleteSpot) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    //? Error handling for invalid user
    let spotUser = await Spot.findByPk(spotId)
    let spotUserJson = spotUser.toJSON()
    
    
    let ownerId = spotUserJson.ownerId

    if (ownerId !== userId) {
        res.status(404)
        return res.json({
            message: "Only the owner is authorized to delete the spot"
        })
    }

    if (deleteSpot) {
        res.status(200)
        return res.json({
            message: "Successfully deleted",
            statusCode: 200
        })
    }
})

//! Get all Reviews by a spot's Id
router.get('/:spotId/reviews', async (req, res, next) => {
    let spotId = req.params.spotId
    let spot = await Spot.findByPk(spotId)

    if (!spot) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    let spotReview = await Review.findOne({
        where: {
            spotId: spotId
        },
        include: [
            {
                model: User
            },
            {
                model: ReviewImage
            }
        ]
    })

    let reviewSpot = spotReview.toJSON()
    delete reviewSpot.User.username
    delete reviewSpot.ReviewImages[0].reviewId
    delete reviewSpot.ReviewImages[0].createdAt
    delete reviewSpot.ReviewImages[0].updatedAt

    res.status(200)
    return res.json({
        Reviews: [reviewSpot]
    })
})

//! Create a Review for a Spot based on the Spot's Id
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    let spotId = req.params.spotId

    const {review, stars} = req.body

    let spotInfo = await Spot.findByPk(spotId)
    let spotInfoJson = spotInfo.toJSON()
    let userId = spotInfoJson.ownerId
    
    //! Create a error response 403 when a review already exists for the spot from the current user

    try {
        spotReview = await Review.create({
            userId: userId,
            spotId: Number(spotId),
            review: review,
            stars: stars
        }, {
            include: [Spot]
        })
        res.status(201)
        return res.json(spotReview)
    } catch (error) {
        res.status(400)
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                review: "Review text is required",
                stars: "Stars must be an integer from 1 to 5"
            }
        })
    }
})




module.exports = router