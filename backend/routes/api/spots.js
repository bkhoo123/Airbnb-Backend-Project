const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');

const {User, Spot, SpotImage, Review, Booking, ReviewImage, sequelize} = require('../../db/models')

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth')

const {Op} = require("sequelize")


//! Get All Spots
//? Extensively Tested on Postman
//* Seed data exists in the database for spots to be returned
//* Successful response includes each spot in the database
//* Spot data returned includes the id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt, previewImage, and avgRating
router.get('/', async (req, res, next) => {

    let { page, size } = req.query
    if(!page) page = 1
    if (!size) size = 20

    //* Page Validation
    if (page < 1) {
        res.status(400)
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                page: "Page must be greater than or equal to 1"
            }
        })
    } 

    //* Size Validation
    if (size < 1) {
        res.status(400)
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                size: "Size must be greater than or equal to 1"
            }
        })
    }


    page = +page
    size = parseInt(size)

    const pagination = {}

    if (page >= 1 && size >= 1) {
        pagination.limit = size; 
        pagination.offset = size * (page - 1)
    }

    let spots = await Spot.findAll({
        include: [
            {
                model: Review,
            },
            {
                model: SpotImage
            }
        ],
        ...pagination
    })

    let spotsList = []
    spots.forEach((spot) => {
        spotsList.push(spot.toJSON())
    }) 

    for (let spot of spotsList) {
        const avgRating = await Review.findAll({
            where: {
                spotId: spot.id
            },
            attributes: [
                [
                    sequelize.fn("AVG", sequelize.col("stars")), "avgRating"
                ]
            ]
        })
        let avgList = []
        avgRating.forEach(avg => {
            avgList.push(avg.toJSON())
        })
        
        for (let avg of avgList) {
            spot.avgRating = avg.avgRating
            if (!spot.avgRating) {
                spot.avgRating = 'No reviews have been posted for this location'
            }
    
        }
        
        delete spot.Reviews
    }
    
    spotsList.forEach(spot => {
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
        Spots: spotsList,
        page: page,
        size: size
    })
    
})


//! Get All Spots Owned by the Current User
//? Extensive Testing Completed on Postman awaiting Render Check
//* An authenticated user is required for a successful response
//* Successful response includes only spots created by the current user
//* Spot data returned includes the id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt, previewImage, and avgRating
router.get('/current', requireAuth, async(req, res, next) => {
    let currentUser = req.user.id
    let spots = await Spot.findAll({
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

    let spotsList = []
    spots.forEach((spot) => {
        spotsList.push(spot.toJSON())
    })
    

    for (let spot of spotsList) {
        const avgRating = await Review.findAll({
            where: {
                spotId: spot.id
            },
            attributes: [
                [
                    sequelize.fn("AVG", sequelize.col("stars")), "avgRating"
                ]
            ]
        })

        let avgList = []
        avgRating.forEach(avg => {
            avgList.push(avg.toJSON())
        })

        for (let avg of avgList) {
            spot.avgRating = avg.avgRating
            if (!spot.avgRating) {
                spot.avgRating = 'No reviews have been posted for this location'
            }
        }

        delete spot.Reviews
    } 

    //* Handles if current user doesn't own any spots
    if (!spots) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            message2: "You don't currently own any spots",
            statusCode: 404
        })
    }

    spotsList.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (!image.preview) {
                spot.previewImage = 'no image available'
            }
            if (image.preview === true) {
                spot.previewImage = image.url
            } 
        })
        delete spot.SpotImages
    })

    res.status(200)
    return res.json({
        Spots: spotsList
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

    
    let spotImage = await SpotImage.create({
        spotId: spotId,
        url,
        preview
    })
    let spotImageJson = spotImage.toJSON()
    delete spotImageJson.spotId
    delete spotImageJson.updatedAt
    delete spotImageJson.createdAt

    res.status(200)
    return res.json(spotImageJson)

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
        res.status(403)
        return res.json({
            message: "Only the owner is authorized to delete the spot"
        })
    }

    if (deleteSpot) {
        res.status(200)
        await deleteSpot.destroy()
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
    //? Bug not showing all reviews
    let spotReview = await Review.findAll({
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

    if (!spotReview) {
        res.status(404) 
        return res.json({
            message: "No reviews for this spot currently",
            statusCode: 404
        })
    }

    let reviewsList = []
    spotReview.forEach((review) => {
        reviewsList.push(review.toJSON())
    })
    
    for (let review of reviewsList) {
        delete review.User.username
        
        let reviewId = review.id

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
            delete review.ReviewImages[i].reviewId
            delete review.ReviewImages[i].createdAt
            delete review.ReviewImages[i].updatedAt
        }
    }
    
    if (reviewsList) {
        res.status(200)
        return res.json({
            Reviews: reviewsList
        })
    }
})

//! Create a Review for a Spot based on the Spot's Id
//? Needs 403 resolved
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    let spotId = req.params.spotId
    let currentUser = req.user.id
    
    const {review, stars} = req.body
    

    let spotInfo = await Spot.findByPk(spotId, {
        include: [
            {
                model: Review
            }
        ]
    })

    //* If Spot can't be found error
    if (!spotInfo) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    
    //* Text required for Reviews Error
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

    //* Ratings must be between 1 to 5
    if (stars < 1 || stars > 5) {
        res.status(400)
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                stars: "Stars must be an integer from 1 to 5"
            }
        })
    }

    //* Review from the current user already exists for the spot Error
    //! Functioning just need extra testing on Render
    let reviewInfo = await Review.findAll({
        where: {
            spotId: spotId
        },
        attributes: ['spotId', 'userId']
    })

    let reviewsList = []
    reviewInfo.forEach((review) => {
        reviewsList.push(review.toJSON())
    })

    for (reviews of reviewsList) {
        if (reviews.spotId == Number(spotId) && reviews.userId == Number(currentUser)) {
            res.status(403)
            return res.json({
                message: "User already has a review for this spot",
                statusCode: 403
            })
        }
    }

    spotReview = await Review.create({
        userId: Number(currentUser),
        spotId: Number(spotId),
        review: review,
        stars: stars,
        
    }, {
        include: Spot
    })
    res.status(201)
    return res.json(spotReview)
    
})

//! Get All Bookings for a Spot based on the Spot's id
//? Extensively Tested on Postman
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    let spotId = req.params.spotId
    let currentUser = req.user.id
    let spotUser = await Spot.findByPk(spotId)
    

    let bookings = await Booking.findAll({
        include: [
            {
                model: User
            }
        ],
        where: {
            spotId: spotId
        },
    })

    if (!spotUser) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    let spotUserJson = spotUser.toJSON()

    let bookList = []
    bookings.forEach((book) => {
        bookList.push(book.toJSON())
    })

    let ownerbookings = []
    
    //! This part is working
    if (currentUser !== spotUserJson.ownerId) {
        bookList.forEach((book) => {
            delete book.User
            delete book.id
            delete book.userId
            delete book.createdAt
            delete book.updatedAt
        })  
        res.status(200)
        return res.json({
            Bookings: bookList
      }) //! Confirmed working
    } else if (currentUser === spotUserJson.ownerId) {
        res.status(200)
        bookList.forEach((book) => {
            const {User, id, userId, startDate, endDate, createdAt, updatedAt} = book
            ownerbookings.push({
                User: User,
                id: id,
                spotId: Number(spotId),
                userId: userId,
                startDate: startDate,
                endDate: endDate,
                createdAt: createdAt,
                updatedAt: updatedAt
            })
            
        })
        res.status(200)
            return res.json({
                Bookings: ownerbookings
        })
    }
})

//! Create a Booking from a Spot based on the Spot's Id
//? Extensively tested on postman
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    let spotId = req.params.spotId
    let currentUser = req.user.id

    let spot = await Spot.findByPk(spotId, {
        include: [
            {
                model: Booking
            }
        ]
    })

    //* Spot can't be found error
    if (!spot) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    let spotUser = spot.toJSON()
    let spotOwnerId = spotUser.ownerId


    //* Spot must not belong to current user
    if (spotOwnerId === currentUser) {
        res.status(403)
        return res.json({
            message: "You cannot book your own place"
        })
    }

    const {startDate, endDate} = req.body

    //* Validation Comparisons
    if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
        res.status(400)
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                endDate: "endDate cannot be on or before startDate"
            }
        })
    }

    //* Booking conflicts
    //? Extensively tested on Postman
    
    let bookings = await Booking.findAll({
        where: {
            spotId: spotId
        },
        attributes: ['startDate', 'endDate']
    })

    let bookingsList = []
    bookings.forEach((book) => {
        bookingsList.push(book.toJSON())
    })
    
    
    for (let book of bookingsList) {
        if (new Date(book.startDate).getTime() >= new Date(startDate).getTime() && new Date(book.endDate).getTime() <= new Date(endDate).getTime()) {
            res.status(400)
            return res.json({
                message: "Validation Error",
                statusCode: 400,
                errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
                }
            })
        }
    }

    try {
        let newBooking = await Booking.create({
            spotId: Number(spotId),
            userId: currentUser,
            startDate: startDate,
            endDate: endDate,
        })
        
        res.status(200)
        return res.json(newBooking)
    } catch (error) {
        res.status(400)
        return res.json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            }
        })
    }
})


module.exports = router