const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');

const {User, Spot, SpotImage, Review, ReviewImage, sequelize} = require('../../db/models')

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth')

const {Op} = require("sequelize")


//! Get All Reviews of the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    let currentUser = req.user.id

    let Reviews = await Review.findOne({
        where: {
            userId: currentUser
        },  
        include: [
            {
                model: User
            },  
            {
                model: Spot
            },
            {
                model: ReviewImage
            }
        ]
    })

    //* preview image
    let review = Reviews.toJSON()

    let spotId = review.spotId
    let preview = await SpotImage.findOne({
        where: {
            spotId: spotId
        }
    })

    let previewJson = preview.toJSON()
    
    if (previewJson.preview === true) {
        review.Spot.previewImage = previewJson.url
    }
    
    //* deleting unneeded parameters in Spot, User and ReviewImages
    delete review.User.username
    delete review.Spot.createdAt
    delete review.Spot.updatedAt
    delete review.ReviewImages[0].reviewId
    delete review.ReviewImages[0].createdAt
    delete review.ReviewImages[0].updatedAt
    
    res.status(200)
    return res.json({
        Reviews: [review]
    })
})

//! Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    let currentUser = req.user.id
    let reviewId = req.params.reviewId

    const {url} = req.body
    
    let reviewUser = await Review.findByPk(reviewId)
    let reviewUserJson = reviewUser.toJSON()
    
    //* If review Id doesn't exist error
    if (!reviewUser) {
        res.status(404)
        return res.json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }
    
    //* Only the owner of the review can post an image error
    let userId = reviewUserJson.userId

    if (userId !== currentUser) {
        res.status(404)
        return res.json({
            message: "Only the owner can add an image to the review"
        })
    }

    //* Create a check here for 10 Images
    let reviewImageCheck = await Review.findByPk(reviewId, {
        include: [
            {
                model: ReviewImage
            }
        ]
    })
    let reviewImageCheckJson = reviewImageCheck.toJSON()
    
    if (reviewImageCheckJson.ReviewImages.length > 10) {
        res.status(403)
        return res.json({
            message: "Maximum number of images for this resource has been reached",
            statusCode: 403
        })
    }
    
    //* where we post the review image returned final product
    let reviewImage = await ReviewImage.create({
        reviewId: reviewId,
        url: url
    }, {
        include:[Review]
    })

    let reviewImageJson = reviewImage.toJSON()

    delete reviewImageJson.reviewId
    delete reviewImageJson.updatedAt
    delete reviewImageJson.createdAt

    res.status(200)
    return res.json(reviewImageJson)
})


//! Edit a Review
router.put('/:reviewId', requireAuth, async (req, res, next) => {

})

//! Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {

})


module.exports = router