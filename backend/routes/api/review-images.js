const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');

const {User, Spot, SpotImage, Review, ReviewImage, sequelize} = require('../../db/models')

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth')

const {Op} = require("sequelize")


//! Delete a Review Image
//? Only the owner of the review is authorized to delete
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    let imageId = req.params.imageId
    let currentUser = req.user.id

    let deleteImage = await ReviewImage.findByPk(imageId)

    //* Error checking if review image doesn't exist 
    if (!deleteImage) {
        res.status(404)
        return res.json({
            message: "Review Image couldn't be found",
            statusCode: 404
        })
    }

    if (deleteImage) {
        res.status(200)
        await deleteImage.destroy()
        return res.json({
            message: "Succesfully deleted",
            statusCode: 200
        })
    }
})


module.exports = router