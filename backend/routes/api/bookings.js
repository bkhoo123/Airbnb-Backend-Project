const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');

const {User, Spot, SpotImage, Review, ReviewImage, sequelize, Booking} = require('../../db/models')

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth')

const {Op} = require("sequelize")


//! Get all of the Current User's Bookings
//? Check if Preview image is false if the code breaks
//? Test Dates are working
router.get('/current', requireAuth, async (req, res, next) => {
    let currentUser = req.user.id

    let bookings = await Booking.findAll({
        where: {
            userId: currentUser
        },
        include: [
            {
                model: Spot
            }
        ]
    })
    let spotArray = []
    let previewImageArray = []
    let booksList = []
    bookings.forEach((book) => {
        booksList.push(book.toJSON())
    })

    if (!bookings) {
        res.status(404)
        return res.json({
            message: "Current user has no Spots",
            statusCode: 404
        })
    }


    booksList.forEach(book => {
        delete book.Spot.description
        delete book.Spot.createdAt
        delete book.Spot.updatedAt
        spotArray.push(book.spotId)
    })
    
    for (let i = 0; i < spotArray.length; i ++) {
        let preview = await SpotImage.findOne({
            where: {
                spotId: spotArray[i]
            }
        })
        previewImageArray.push(preview.toJSON())
        if (previewImageArray[i].preview === true) {
            booksList[i].Spot.previewImage = previewImageArray[i].url
        } 
    }

    let newBooksList = []

    booksList.forEach(book => {
        const {id, spotId, Spot, userId, startDate, endDate, createdAt, updatedAt} = book
        newBooksList.push({
            id: id,
            spotId: spotId,
            Spot: Spot,
            userId: userId,
            startDate: startDate,
            endDate: endDate,
            createdAt: createdAt,
            updatedAt: updatedAt
        }) 
    })

    res.status(200)
    return res.json({
        Bookings: newBooksList
    })
})







module.exports = router