const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');

const {User, Spot, SpotImage, Review, ReviewImage, sequelize, Booking} = require('../../db/models')

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth')

const {Op} = require("sequelize")


//! Delete a Spot Image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    let currentUser = req.user.id
    let imageId = req.params.imageId

    let spotImage = await SpotImage.findByPk(imageId)

    //! Confirmed working
    //* Spot Image can't be found error
    if (!spotImage) {
        res.status(404)
        return res.json({
            message: "Spot Image couldn't be found",
            statusCode: 404
        })
    }

    let spotImageJson = spotImage.toJSON()
    let spotId = spotImageJson.spotId
    
    let spot = await Spot.findByPk(spotId)
    let spotJson = spot.toJSON()
    let userId = spotJson.ownerId

    //* Spot Image can only be deleted by owner
    //! Confirmed working
    if (currentUser !== userId) {
        res.status(403)
        return res.json({
            message: "You can only delete this image if you are the owner of the spot",
            statusCode: 403
        })
    }

    //* If above errors don't hit delete the spot Image
    //! Confirmed working
    if (spotImage) {
        res.status(200) 
        await spotImage.destroy()
        return res.json({
            message: "Successfully deleted",
            statusCode: 200
        })
    }
})



module.exports = router