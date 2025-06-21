// *
// ?
// !
// TODO
// normal
const express = require('express')
const { connectDB } = require('./config/database')
const app = express()
const { User } = require('./models/user')
// ? A middleware for conversion of any body sent through postman in terms os json to a js object
app.use(express.json())

app.post('/signup', async (req, res) => {
  //* to do dynamically by the help of postman using body in json
  //console.log(req.body)

  //creating a new instance of User model
  //! this was hard coding way and should not be done
  // const user = new User({
  //   firstName: 'Asisha',
  //   lastName: 'Kumar'
  // })
  const user = new User(req.body)
  try {
    await user.save() //this would be a promise obj so save use await (in mongo db)
    res.send('user signed up successfully')
  } catch (error) {
    res.status(500).send('not updated or signed up' + error.message)
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
