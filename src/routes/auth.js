const authController = require('../controllers/auth')
const User = require('../models/user')
const express = require('express')

const router = express.Router()
const { body } = require('express-validator/check')



router.put('/signup', [
  body('email')
    .isEmail()
    .withMessage('Please use a valid email address')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject("E-Mail Address already exist")
        }
      })
    }).normalizeEmail(),
  body('password').trim().isLength({ min: 5 }),
  body('name').trim().not().isEmpty(),
], authController.signup);

router.post('/login', authController.login)
module.exports = router;