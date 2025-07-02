const express = require('express')
const profileRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const { User } = require('../models/user')
const { validateEditProfileData } = require('../utils/validation')
const validator = require('validator')


//profile API will get the profile of user

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user
    res.send(user)
  } catch (error) {
    res.status(400).send('ERROR: ' + error.message)
  }
})

//profile edit api
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('invalid')
    }
    const loggedInUser = req.user
    Object.keys(req.body).forEach(key => (loggedInUser[key] = req.body[key]))
    await loggedInUser.save()
    res.json({
      message: `${loggedInUser.firstName}, your id is updated`,
      data: loggedInUser
    })

    //console.log(loggedInUser)
  } catch (error) {
    res.status(400).send('not valid : ' + error.message)
  }
})

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user
    const { password } = req.body
    const isPasswordSameAsOld = loggedInUser.validatePassword(password)
    if (!isPasswordSameAsOld) {
        const passwordHash = await bcrypt.hash(password, 10)
        
      loggedInUser.password = passwordHash
    }
    await loggedInUser.save()
    res.json(`${loggedInUser.password} is updated`)
  } catch (error) {}
})
module.exports = profileRouter
