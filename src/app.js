// *
// ?
// !
// TODO
// normal
const express = require('express')
const { connectDB } = require('./config/database')
const app = express()
const { User } = require('./models/user')
const validator = require('validator')
const { validateSignUpData } = require('./utils/validation')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

// ? A middleware for conversion of any body sent through postman in terms os json to a js object
app.use(express.json())
app.use(cookieParser()) //it act as cookie parser whenever the user wants to do something with its account m, he can parse it through this middleware with all the fields

app.post('/signup', async (req, res) => {
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

    await user.save() //this would be a promise obj so save use await (in mongo db)
    res.send('user signed up successfully')
  } catch (error) {
    res.status(500).send('ERROR : ' + error.message)
  }
})
//login
app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body
    if (!validator.isEmail(emailId)) {
      throw new Error('error it is not mail')
    }
    const user = await User.findOne({ emailId: emailId }).exec()
    if (!user) {
      throw new Error('Invalid Credentials')
    }
    const isPasswordvalid = await bcrypt.compare(password, user.password)
    if (isPasswordvalid) {
      //use of JWT (create a JWT token)
      const token = await jwt.sign(
        { _id: user._id },
        /* a secret key*/ 'AsishKumar'
      )
      //use of cookies (add the token tio cookie) and send back to the user as the browser saves token

      //this will be stored in key:cookie (value pair)
      res.cookie('token', token)
      res.send('login successfully')
    } else {
      throw new Error('Invalid Credentials')
    }
  } catch (error) {
    console.error('error' + error.message)
    res.status(400).send('Error : ' + error.message)
  }
})

//profile API will get the profile of user

app.get('/profile', async (req, res) => {
  try {
    const cookies = req.cookies
    const { token } = cookies
    if (!token) {
      throw new Error('there is no token')
    }
    //validate my token
    const decodedSentHidden = await jwt.verify(token, 'AsishKumar') //! same as the secret key u sent above
    const { _id } = decodedSentHidden
    const user = await User.findById(_id)
    if (!user) {
      throw new Error('error finding the id __profile may not exist')
    }

    //console.log(decodedSentHidden)
    //console.log(cookies)
    //console.log(user)
    res.send(user)
  } catch (error) {
    res.status(500).send('ERROR : ' + error.message)
  }
})
// get user by email (any user)
app.get('/user', async (req, res) => {
  const userName = req.body.firstName
  //to find the documents containing this email id
  const doc = await User.find({ firstName: userName })
  try {
    if (doc) {
      res.send(doc)
    } else {
      res.status(404).send('not able to find the user')
    }
  } catch (error) {
    res.send('error fetching')
  }
})

//feed Api - GET /feed - get all the users in the database
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (error) {
    res.status(404).send('not able to find the document that')
  }
})

//find by id and delete
app.delete('/user', async (req, res) => {
  const userId = req.body.userID
  try {
    if (userId) {
      await User.findByIdAndDelete(userId)
      res.send('deletd the : ' + userId)
    } else {
      res.send('not able to delete')
    }
  } catch (error) {
    res.status(404).send('error getting userId')
  }
})

//update the data of the user
app.patch('/user/:userID', async (req, res) => {
  const userID = req.params?.userID
  const updateInfo = req.body

  try {
    //? there must be only minimal things once entered it wont be able to change until the account exist
    if (!validator.isEmail(req?.body.emailId)) {
      throw new Error('email is invalid')
    }

    const Allowed_updates = [
      'about',
      'gender',
      'about',
      'age',
      'skills',
      'photoUrl'
    ]

    const isUpdateAllowed = Object.keys(updateInfo).every(key =>
      Allowed_updates.includes(key)
    )
    if (!isUpdateAllowed) {
      throw new Error('updation not Allowed')
    }

    await User.findByIdAndUpdate(userID, updateInfo, {
      returnDocument: 'after',
      runValidators: true
    })
    res.send('updated the document successfully : ')
  } catch (error) {
    // console.log(error)
    res.status(404).send('error updating user')
  }
})
connectDB()
  .then(() => {
    console.log('connection established with database')
    app.listen(3000, () => {
      console.log('listening to port 3000')
    })
  })
  .catch(error => {
    console.error('Error connectiong to Database')
  })
