const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


// backend/routes/api/users.js
// ...
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];


// Sign up // Functioning in Development
router.post('/', validateSignup, async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;

    // Error response for duplicate email
    let emailArray = []
      
    emailArray = await User.findAll({
        attributes: ['email']
    })

    for (let i = 0; i < emailArray.length; i ++) {
      if (emailArray[i].email === email) {
        res.status(403)
        return res.json({
          message: "User already exists",
          duplicateEmail: emailArray[i].email,
          email: email,
          statusCode: 403,
          errors: {
            email: "User with that email already exists"
          }
        })
      }
    }

    // Error Response for duplicate username
    let userArray = await User.findAll({
      attributes: ['username']
    })

    for (let i = 0; i < userArray.length; i ++) {
      if (userArray[i].username === username) {
        res.status(403)
        return res.json({
          message: "User already exists",
          statusCode: 403,
          errors: {
            username: "User with that username already exists"
          }
        })
      }
    }
     
    // Checking Either Validation errors or the real sign up
    try {
      const user = await User.signup({ username, email, password, firstName, lastName});
      return res.json({
        user: user.toSafeObject(),
        token: await setTokenCookie(res, user)
    });
    } catch (error) {
      res.status(400)
      return res.json({
        message: "Validation error",
        statusCode: 400,
        errors: {
          email: "Invalid email",
          username: "Username is required",
          firstName: "First Name is required",
          lastName: "Last Name is required"
        }
      })
    }
  } 
);

module.exports = router;
