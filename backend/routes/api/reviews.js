const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');

const {User, Spot, SpotImage, Review, ReviewImage, sequelize} = require('../../db/models')

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth')

const {Op} = require("sequelize")


//! Get All Reviews of the Current User
//? Extensively Tested on Postman
router.get('/current', requireAuth, async (req, res, next) => {
    let currentUser = req.user.id


    let Reviews = await Review.findAll({
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
            },
        ]
    })

    let reviewsList = []
    Reviews.forEach((review) => {
        reviewsList.push(review.toJSON())
    })

    if (!Reviews) {
        res.status(404)
        return res.json({
            message: "Current user does not have any reviews",
            status: 404
        })
    }
    let reviewArray = []
    let previewImageArray = []

    for (let i = 0; i < reviewsList.length; i ++) {
        delete reviewsList[i].User.username
        delete reviewsList[i].Spot.createdAt
        delete reviewsList[i].Spot.updatedAt
        reviewArray.push(reviewsList[i].spotId)


        if (reviewsList[i].ReviewImages[i] !== undefined) {
            delete reviewsList[i].ReviewImages[i].reviewId
        }

        if (reviewsList[i].ReviewImages[i] !== undefined) {
            delete reviewsList[i].ReviewImages[i].createdAt
        }

        if (reviewsList[i].ReviewImages[i] !== undefined) {
            delete reviewsList[i].ReviewImages[i].updatedAt
        }
    }
    
    for (let i = 0; i < reviewArray.length; i ++) {
        let preview = await SpotImage.findOne({
            where: {
                spotId: reviewArray[i]
            }
        })
        previewImageArray.push(preview.toJSON())
        if (previewImageArray[i].preview === true) {
            reviewsList[i].Spot.previewImage = previewImageArray[i].url
        }
    }
    
    
    res.status(200)
    return res.json({
        Reviews: reviewsList
    })
})

//! Add an Image to a Review based on the Review's id
//? Extensively Tested on Postman
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    let currentUser = req.user.id
    let reviewId = req.params.reviewId

    const {url} = req.body
    
    let reviewUser = await Review.findByPk(reviewId)
    
    
    //* If review Id doesn't exist error
    if (!reviewUser) {
        res.status(404)
        return res.json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }

    let reviewUserJson = reviewUser.toJSON()
    
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
//? Extensively tested on postman
router.put('/:reviewId', requireAuth, handleValidationErrors, async (req, res, next) => {
    let currentUser = req.user.id // 2
    let reviewId = req.params.reviewId

    const {review, stars} = req.body

    //* Checking if a review exists with a specified id
    let updateReview = await Review.findByPk(reviewId)

    if (!updateReview) {
        res.status(404)
        return res.json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }

    
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

    if (stars > 5 || stars < 1) {
        res.status(400)
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                stars: "Stars must be an integer from 1 to 5"
            }
        })
    }

    if (!review) {
        res.status(400)
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                review: "Review text is required"
            }
        })
    }
    
    updateReview.set({
        review,
        stars
    })

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
//? Extensively Tested on Postman
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

// fanId: {
//     type: Sequelize.INTEGER,
//     references: {model: 'Fans'},
//     ondelete: 'CASCADE'
//   },
//   playerId: {
//     type: Sequelize.INTEGER,
//     references: {model: 'Players'},
//     onDelete: 'CASCADE'
//   },


module.exports = router