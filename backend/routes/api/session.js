// backend/routes/api/session.js
const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const {Op} = require("sequelize")
// ...

// will check if credentials or password is empty and if it is an error will be returned
const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ];

// Get the Current User
router.get('/', validateLogin, async (req, res, next) => {
  
})


// Log in
router.post('/', validateLogin, async (req, res, next) => {
      const { credential, password } = req.body;
  
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
      
      try {
        return res.json({
          user: {
              id: findUser.id,
              firstName: findUser.firstName,
              lastName: findUser.lastName,
              email: credential,
              username: findUser.username,
              token: await setTokenCookie(res, user)
          }
        });
      } catch (error){
        res.status(400)
        return res.json({
          message: "Validation error",
          statusCode: 400,
          errors: {
            credential: "Email or username is required",
            password: "Password is required"
          }
        })
      }   
  }
);



// Restore session user
router.get(
    '/',
    restoreUser,
    (req, res) => {
      const { user } = req;
      if (user) {
        return res.json({
          user: user.toSafeObject()
        });
      } else return res.json({ user: null });
    }
  );
  
  // ...



// Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
);
  



module.exports = router;