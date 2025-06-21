const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 30
    },
    lastName: {
      type: String
    },
    age: {
      type: Number,
      min: 18
    },
    password: {
      type: String,
      required: true
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true //trimp spaces
    },
    gender: {
      type: String,
      //! wont be applicable for older documents as in previous (before) we use validation
      //* use options in updateId wala patch use runValidators to true for older documents , newer by defualt will pass through these
      validate (value) {
        if (!['male', 'female', 'other'].includes(value)) {
          throw new Error('Gender is not valid')
        }
      }
    },
    about: {
      type: String,
      default: 'This is a default description of a user'
    },
    skills: {
      type: [String]
    },
    photoUrl: {
      type: String,
      default: 'https://geographyandyou.com/images/user-profile.png'
    }
  },
  {
    timestamps: true
  }
)

//* Now we create a mongoose model

const User = mongoose.model('User', userSchema)
//*  -> Collection will be "users" (Mongoose pluralizes)

module.exports = { User }
