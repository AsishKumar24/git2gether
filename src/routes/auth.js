const express = require('express')
const authRouter = express.Router()
const { User } = require('../models/user')
const { validateSignUpData } = require('../utils/validation')
const bcrypt = require('bcrypt')
const validator = require('validator')

authRouter.post('/signup', async (req, res) => {
  //* to do dynamically by the help of postman using body in json
  //console.log(req.body)

  //creating a new instance of User model
  //! this was hard coding way and should not be done
  // const user = new User({
  //   firstName: 'Asisha',
  //   lastName: 'Kumar'
  // })

  //* validate -> encrypt -> create -> save
  //! encrypt the password and dont trust on req.body
  //utility function

  try {
    validateSignUpData(req)
    const { firstName, lastName, password, emailId } = req.body
    //encrypt hash
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({
      firstName,
      lastName,
      password: passwordHash,
      emailId
    })

    const savedUser = await user.save() //this would be a promise obj so save use await (in mongo db)

    const token = await savedUser.getJWT()

    res.cookie('token', token, {
      expires: new Date(Date.now() + 8 * 3600000)
    })

    res.json({ message: 'User Added successfully!', data: savedUser })
  } catch (error) {
    res.status(500).send('ERROR : ' + error.message)
  }
})

//login
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body
    if (!validator.isEmail(emailId)) {
      throw new Error('error it is not mail')
    }
    const user = await User.findOne({ emailId: emailId }).exec()
    if (!user) {
      throw new Error('Invalid Credentials')
    }
    const isPasswordvalid = await user.validatePassword(password)
    if (isPasswordvalid) {
      //use of JWT (create a JWT token)
      const token = await user.getJWT()
      res.cookie('token', token)
      res.send(user)
    } else {
      throw new Error('Invalid Credentials')
    }
  } catch (error) {
    console.error('error' + error.message)
    res.status(400).send('Error : ' + error.message)
  }
})

//logout
authRouter.post('/logout', async (req, res) => {
  //logic behind this is delete the token
  res.cookie('token', null, {
    expires: new Date(Date.now())
  })
  res.send('cookie expired and the user is logged out')
})
module.exports = authRouter
