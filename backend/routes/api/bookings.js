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

    //* Checking to see if the current user has any bookings
    if (!bookings) {
        res.status(404) 
        return res.json({
            message: "You currently don't have any bookings",
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
        } else if (previewImageArray[i].preview === false) {
            booksList[i].Spot.previewImage = 'Currently no preview images exist'
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


//! Edit a Booking
//? Booking must belong to the current User
router.put('/:bookingId', requireAuth, async (req, res, next) => {
    let bookingId = req.params.bookingId
    let currentUser = req.user.id

    let book = await Booking.findByPk(bookingId)

    //* Error if it can't be found
    //! Confirmed working
    if (!book) {
        res.status(404)
        return res.json({
            message: "Booking couldn't be found",
            statusCode: 404
        })
    }

    let bookJson = book.toJSON()
    const {startDate, endDate} = req.body

    //* Errors for it must be a booking that belongs to the current user
    //! Confirmed working
    if (currentUser !== bookJson.userId) {
        res.status(403) 
        return res.json({
            message: "Only the owner can edit this booking",
            statusCode: 403
        })
    }

    //* Body Validation Errors 
    //! Confirmed Working
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

    //* Past bookings can't be modified
    //! Confirmed Working
    //? Double check && functionality
    if (new Date(startDate).getTime() < new Date().getTime() && new Date(endDate).getTime() < new Date().getTime()) {
        res.status(403)
        return res.json({
            message: "Past bookings can't be modified",
            statusCode: 403
        })
    } 

    //* Booking Conflict
    //! Confirmed Working
    let bookings = await Booking.findAll({
        where: {
            spotId: bookJson.spotId
        },
        attributes: ['startDate', 'endDate']
    })

    let bookingsList = []
    bookings.forEach((book) => {
        bookingsList.push(book.toJSON())
    })
    
    
    for (let book of bookingsList) {
        if (new Date(book.startDate).getTime() >= new Date(startDate).getTime() && new Date(book.endDate).getTime() <= new Date(endDate).getTime()) {
            res.status(403)
            return res.json({
                message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
                }
            })
        }
    }
    
    book.set({
        spotId: bookJson.spotId,
        userId: Number(currentUser),
        startDate: startDate,
        endDate: endDate,
    })

    await book.save()
    res.status(200)
    return res.json(book)
    
})

//! Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    let currentUser = req.user.id
    let bookingId = req.params.bookingId

    let book = await Booking.findByPk(bookingId)

    //* Error if it can't be found
    //! Confirmed working
    if (!book) {
        res.status(404)
        return res.json({
            message: "Booking couldn't be found",
            statusCode: 404
        })
    }
    let bookJson = book.toJSON()

    //* Errors for it must be a booking that belongs to the current user
    //! Confirmed working
    if (currentUser !== bookJson.userId) {
        res.status(403) 
        return res.json({
            message: "Only the owner can delete this booking",
            statusCode: 403
        })
    }

    const {startDate, endDate} = bookJson


    //* Error response: Bookings that have been started can't be deleted
    //! Confirmed functioning
    if (new Date(startDate).getTime() <= new Date().getTime() && new Date().getTime() <= new Date(endDate).getTime()) {
        res.status(403)
        return res.json({
            message: "Bookings that have been started can't be deleted",
            statusCode: 403
        })
    }

    // //* Error response with status 400 is given when it is past the booking's startDate (no deleting of current or past bookings)
    // //! Confirmed Functioning
    // if (new Date(startDate).getTime() <= new Date().getTime()) {
    //     res.status(400)
    //     return res.json({
    //         message: "No deleting of current or past bookings",
    //         statusCode: 400
    //     })
    // }
    

    //* Delete book if none of the errors above get hit 
    //! Confirmed Able to delete future bookings
    //! Confirmed functioning
    if (book) {
        res.status(200)
        await book.destroy()
        return res.json({
            message: "Successfully deleted",
            statusCode: 200
        })
    }
})



module.exports = router