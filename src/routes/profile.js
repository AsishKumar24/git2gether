const express = require('express')
const profileRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const { User } = require('../models/user')



//profile API will get the profile of user

profileRouter.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user
    res.send(user)
  } catch (error) {
    res.status(400).send('ERROR: ' + error.message)
  }
})
module.exports = profileRouter

