const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');



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


//! Sign up 
//? Passed Alec's Pretest
//* New user exists in the database after request
//* Successful response includes newly created id, firstName, lastName, email, and token
//* Error response with status 403 is given when the specified email already exists 
//* Error response with status 400 is given when body validations for the email, firstName, or lastName are violated 
router.post('/', async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;


    //! Confirmed functioning on Render 
    //* Error response for duplicate email
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

    //! Confirmed Functioning on Render
    //* Error Response for duplicate username
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

    //* Validation Error for first name
    if (!firstName) {
      res.status(400)
      return res.json({
        message: "Validation error",
        statusCode: 400,
        errors: {
          firstName: "First Name is required",
        }
      })
    }

    //* Validation Error for last name
    if (!lastName) {
      res.status(400)
      return res.json({
        message: "Validation error",
        statusCode: 400,
        errors: {
          lastName: "Last Name is required",
        }
      })
    }

    //* Validation Error for username
    if (!username || username.length < 5) {
      res.status(400)
      return res.json({
        message: "Validation error",
        statusCode: 400,
        errors: {
          username: "Username is required",
          usernamelength: "Please provide a username with at least 4 characters."
        }
      })
    }

    //* Validation Errors for empty fields
    if (firstName === '' || lastName === '' || username === '') {
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

    //! Test this feature exclusively to see if it is working
    //* Validation Error for Email
    if (!email.includes('@') || !email.includes('.com')) {
      res.status(400)
      return res.json({
        message: "Validation error",
        statusCode: 400,
        errors: {
          email: "Invalid email",
        }
      })
    }
     
    //* Checking Either Validation errors or the real sign up
    try {
      const user = await User.signup({ username, email, password, firstName, lastName});
      return res.json({
        user: user.toSafeObject(),
        token: await setTokenCookie(res, user)
        //? Possibly might need to change token to show up as an empty string
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
