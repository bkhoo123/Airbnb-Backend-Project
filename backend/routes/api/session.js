// backend/routes/api/session.js
const express = require('express');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')
const { Op } = require("sequelize")


// will check if credentials or password is empty and if it is an error will be returned
// const validateLogin = [
//     check('credential')
//       .exists({ checkFalsy: true })
//       .notEmpty()
//       .withMessage('Please provide a valid email or username.'),
//     check('password')
//       .exists({ checkFalsy: true })
//       .withMessage('Please provide a password.'),
//     handleValidationErrors
// ];



//! Log in
router.post('/', async (req, res, next) => {
      const { credential, password } = req.body;

      //! This feature isn't confirmed on Render yet
      //? Confirmed on Postman
      if (!credential) {
        res.status(400)
        return res.json({
          message: "Validation error",
          statusCode: 400,
          errors: {
            credential: "Email or username is required",
          }
        })
      }
      
      //! This feature isn't confirmed on Render yet
      //? Confirmed on Postman
      if (!password) {
        res.status(400)
        return res.json({
          message: "Validation error",
          statusCode: 400,
          errors: {
            credential: "Password is required",
          }
        })
      }
  
      const user = await User.login({ credential, password });
  
      if (!user) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = ['The provided credentials were invalid.'];
        return next(err);
      }
  
      let findUser = await User.findOne({
        where: {
          [Op.or]: [{email: credential}, {username: credential}]
        }
      })
      
      await setTokenCookie(res, user)

      return res.json({
        user: {
            id: findUser.id,
            firstName: findUser.firstName,
            lastName: findUser.lastName,
            email: credential,
            username: findUser.username, 
        }
      });
  }
);




//! Restore session user
router.get('/', restoreUser, (req, res, next) => {
  const { user } = req;
  if (user) {
    return res.json({
      user: user.toSafeObject()
    });
  } else {
    res.json({ user: null });
    next()
  }
});

//! Get the Current User
router.get('/', requireAuth, async (req, res, next) => {
  let currentUser = req.user
  return res.json(currentUser)
})

//! Logout
//? Confirmed Functioning on Render 
router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);
  



module.exports = router;