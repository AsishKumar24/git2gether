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
    res.status(500).send('not updated or signed up ' + error.message)
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
    if (!isUpdateAllowed)
    {
      throw new Error("updation not Allowed")
    }

    await User.findByIdAndUpdate(userID, updateInfo, {
      returnDocument: 'after',
      runValidators: true
    })
    res.send('updated the document successfully : ')
  } catch (error) {
    console.log(error)
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
