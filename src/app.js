// *
// ?
// !
// TODO
// normal
const express = require('express')
const { connectDB } = require('./config/database')
const app = express()
const cookieParser = require('cookie-parser')

// ? A middleware for conversion of any body sent through postman in terms os json to a js object
app.use(express.json())
app.use(cookieParser()) //it act as cookie parser whenever the user wants to do something with its account m, he can parse it through this middleware with all the fields


//* importing all the router from routes
const authRouter = require('./routes/auth')
const reqRouter = require('./routes/connection_request')
const profileRouter = require('./routes/profile')

app.use('/', authRouter)
app.use('/', reqRouter)
app.use('/', profileRouter)

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
