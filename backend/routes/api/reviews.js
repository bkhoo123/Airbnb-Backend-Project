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
//? Review must belong to the current user
router.put('/:reviewId', requireAuth, handleValidationErrors, async (req, res, next) => {
    let currentUser = req.user.id // 2
    let reviewId = req.params.reviewId

    const {review, stars} = req.body
    

    //* Checking if review belongs to the current user
    let userId = await Review.findByPk(reviewId)
    let userIdJson = userId.toJSON()
    if (userIdJson.userId !== currentUser) {
        res.status(404)
        return res.json({
            message: "You are not authorized to edit this review",
            statusCode: 404
        })
    }

    //* Checking if a review exists with a specified id
    let updateReview = await Review.findByPk(reviewId)

    if (!updateReview) {
        res.status(404)
        return res.json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }

    updateReview.set({
        review,
        stars
    })

    if (stars > 5 || stars < 1 || review === '') {
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

    //* Updating the review unless it hits validation errors
    try {
        updateReview.save()
        res.status(200)
        res.json(updateReview)
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



//! Delete a Review
//? Foreign Key constraint failing 
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    let currentUser = req.user.id
    let reviewId = req.params.reviewId

     //* Checking for proper authorization
     let userId = await Review.findByPk(reviewId)
     let userIdJson = userId.toJSON()
     if (userIdJson.userId !== currentUser) {
         res.status(400)
         return res.json({
             message: "You are not authorized to edit this review",
             statusCode: 400
        })
    }

    //! Fix this area
    //* Checking if a review exists with a specified id
    let deleteReview = await Review.findByPk(reviewId)

    if (!deleteReview) {
        res.status(404)
        return res.json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }

    if (deleteReview) {
        res.status(200) 
        await deleteReview.destroy()
        return res.json({
            message: "Successfully deleted",
            statusCode: 200
        })
    }
})


module.exports = router