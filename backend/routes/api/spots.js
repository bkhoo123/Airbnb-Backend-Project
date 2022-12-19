const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');

const {User, Spot, SpotImage, Review, sequelize} = require('../../db/models')

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth')

const {Op} = require("sequelize")



//! Get All Spots
//? Avg Rating
//? previewImage
router.get('/', async (req, res, next) => {
    let spot = await Spot.findAll()

    const {id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt} = spot


    // let avgRating = await Review.findAll({
    //     where: {
    //         userId: currentUser
    //     },
    //     attributes: [
    //         [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
    //     ]
    // })

    // let previewImage = await SpotImage.findOne({
    //     where: {
    //         spotId: id
    //     },
    //     attributes: ['url']
    // })

    res.status(200)
    return res.json({
        Spots: spot    
    })
    
})


//! Get All Spots Owned by the Current User
router.get('/current', requireAuth, async(req, res, next) => {
    let currentUser = req.user.id
    let spot = await Spot.findOne({
        where: {
            ownerId: currentUser
        }
    })
    console.log(spot)

    const {id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt} = spot

    let avgRating = await Review.findOne({
        where: {
            userId: currentUser
        },
        attributes: [
            [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
        ]
    })
    

    let previewImage = await SpotImage.findOne({
        where: {
            spotId: id
        },
        attributes: ['url']
    })
    
    res.status(200)
    return res.json({
        
        spot: [
            {
            id,
            ownerId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            createdAt,
            updatedAt,
            avgRating: avgRating.dataValues.avgRating,
            previewImage: previewImage.dataValues.url
            }
        ]
    })
})





//! Get details of a Spot from an id 
router.get('/:spotId', async (req, res, next) => {
    let spotId = req.params.spotId

    let spotDetails = await Spot.findByPk(spotId)

    if (!spotDetails) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    const {id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt} = spotDetails

    let numReviews = await Review.findOne({
        where: {
            spotId: spotId
        },
        attributes: [
            [sequelize.fn('Count', sequelize.col('review')), 'numReviews']
        ]
    })
    
    let avgStarRating = await Review.findOne({
        where: {
            spotId: spotId
        },
        attributes: [
            [sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating']
        ]
    })

    let spotImage = await SpotImage.findAll({
        where: {
            spotId: spotId
        }
    })

    let owner = await User.findAll({
        attributes: ['id', 'firstName', 'lastName'],
        where: {
            id: spotDetails.dataValues.ownerId
        }
    })
    
    res.status(200)
    return res.json({
        id,
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        createdAt,
        updatedAt,
        numReviews: numReviews.dataValues.numReviews,
        avgStarRating: avgStarRating.dataValues.avgStarRating,
        spotImage,
        owner
    })
})


//Create a spot
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

module.exports = router