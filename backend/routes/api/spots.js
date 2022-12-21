const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');

const {User, Spot, SpotImage, Review, Booking, ReviewImage, sequelize} = require('../../db/models')

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth')

const {Op} = require("sequelize")

// attributes: [
//     [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
// ]

//! Get All Spots
//? Avg Rating Needs fine tuning 
router.get('/', async (req, res, next) => {
    let spots = await Spot.findAll({
        include: [
            {
                model: Review,
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
    console.log(spotsList[0])
    
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
//? Extensive Testing Completed on Postman awaiting Render Check
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
    

    //* Handles if current user doesn't own any spots
    if (!spot) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            message2: "You don't currently own any spots",
            statusCode: 404
        })
    }
    

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
//? Extensive Testing Completed on Postman
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
router.post('/', requireAuth, async (req, res, next) => {
    const {address, city, state, country, lat, lng, name, description, price} = req.body

    //* Address validation error
    if (!address) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                address: "Street address is required"
            }
        })
    }
    
    //* City Validation Error
    if (!city) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                city: "City is required"
            }
        })
    }

    //* State Validation Error
    if (!state) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                state: "State is required"
            }
        })
    }

    //* Country Validation Error
    if (!country) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                country: "Country is required"
            }
        })
    }

    //* Latitude Validation Error
    if (lat > 200 || lat < -200) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                lat: "Latitude is not valid"
            }
        })
    }

    //* Longitude Validation Error
    if (lng > 200 || lng < -200) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                lng: "Longitude is not valid"
            }
        })
    }

    //* Name must be less than 50 characters
    if (name.length > 50) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                name: "Name must be less than 50 characters"
            }
        }) 
    }

    //* Description validation error
    if (!description) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                description: "Description is required"
            }
        })
    }

    //* Price Validation Error
    if (!price) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                price: "Price per day is required"
            }
        })
    }

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
//? Tested Extensively on Postman 
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    let spotId = req.params.spotId
    let userId = req.user.id

    

    let spotUser = await Spot.findByPk(spotId)

    if (!spotUser) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    let spotUserJson = spotUser.toJSON()

    
    
    let ownerId = spotUserJson.ownerId

    if (ownerId !== userId) {
        res.status(403)
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
//? Extensively Tested on Postman
router.put('/:spotId', requireAuth, async (req, res, next) => {
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
        res.status(403)
        return res.json({
            message: "Only the owner is authorized to update the spot"
        })
    }

    //? Confirmed Functioning and Validation errors are functioning
    const {address, city, state, country, lat, lng, name, description, price} = req.body    

    //* Address validation error
    if (!address) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                address: "Street address is required"
            }
        })
    }
    
    //* City Validation Error
    if (!city) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                city: "City is required"
            }
        })
    }

    //* State Validation Error
    if (!state) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                state: "State is required"
            }
        })
    }

    //* Country Validation Error
    if (!country) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                country: "Country is required"
            }
        })
    }

    //* Latitude Validation Error
    if (lat > 200 || lat < -200) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                lat: "Latitude is not valid"
            }
        })
    }

    //* Longitude Validation Error
    if (lng > 200 || lng < -200) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                lng: "Longitude is not valid"
            }
        })
    }

    //* Name must be less than 50 characters
    if (name.length > 50) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                name: "Name must be less than 50 characters"
            }
        }) 
    }

    //* Description validation error
    if (!description) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                description: "Description is required"
            }
        })
    }

    //* Price Validation Error
    if (!price) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                price: "Price per day is required"
            }
        })
    }

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
//? Extensively Tested on Postman
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
//? Extensively tested on postman
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
                model: ReviewImage,
            }
        ]
    })

    let reviewSpot = spotReview.toJSON()
    delete reviewSpot.User.username
    
    let reviewId = reviewSpot.id

    let reviewCount = await ReviewImage.findAll({
        where: {
            reviewId: reviewId
        }
    })
    let reviewList = []
    reviewCount.forEach((review) => {
        reviewList.push(review.toJSON())
    })
    

    for (let i = 0; i < reviewList.length; i ++) {
        delete reviewSpot.ReviewImages[i].reviewId
        delete reviewSpot.ReviewImages[i].createdAt
        delete reviewSpot.ReviewImages[i].updatedAt
    }

    res.status(200)
    return res.json({
        Reviews: [reviewSpot]
    })
})

//! Create a Review for a Spot based on the Spot's Id
//? Needs 403 resolved
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    let spotId = req.params.spotId
    let currentUser = req.user.id
    

    const {review, stars} = req.body

    let spotInfo = await Spot.findByPk(spotId)
    let spotInfoJson = spotInfo.toJSON()
    let userId = spotInfoJson.ownerId
    

    if (!review) {
        res.status(400)
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                review: "Review Text is required"
            }
        })
    }

    if (stars < 0 || stars > 5) {
        res.status(400)
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                stars: "Stars must be an integer from 1 to 5"
            }
        })
    }
    
    
    //! Create a error response 403 when a review already exists for the spot from the current user

    try {
        spotReview = await Review.create({
            userId: currentUser,
            spotId: Number(spotId),
            review: review,
            stars: stars,
            
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