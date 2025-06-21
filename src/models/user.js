const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  age: Number,
  password: String,
  emailId: String,
  gender: String
})

//* Now we create a mongoose model

const User = mongoose.model('User', userSchema)

module.exports = { User }
