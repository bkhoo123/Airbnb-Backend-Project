const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');

const {User, Spot, SpotImage, Review, Booking, ReviewImage, Favorite, sequelize} = require('../../db/models')

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth')

const {Op} = require("sequelize")


router.get('/current', requireAuth, async(req, res, next) => {
    let currentUser = req.user.id

    let favorites = await Favorite.findAll({
        where: {
            userId: currentUser
        },
        include: [
            {
                model: Spot
            },
        ]
    })

    
    if (!favorites) {
        res.status(404)
        return res.json({
            message: "You currently don't have any favorites",
            statusCode: 404
        })
    }

    return res.json({
        favorites
    })
})

router.delete('/:favoriteId', requireAuth, async (req, res, next) => {
    let currentUser = req.user.id
    let favoriteId = req.params.favoriteId

    let favorite = await Favorite.findByPk(favoriteId)

    if (!favorite) {
        res.status(404)
        return res.json({
            message: "Favorite couldn't be found",
            statusCode: 404
        })
    }

    await favorite.destroy()
    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    })
})

module.exports = router