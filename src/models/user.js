const mongoose = require('mongoose')
const { Schema } = mongoose
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
      required: true,
      validate (value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error('the password was not strong enough : ' + value)
        }
      }
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
      // validate: {
      //   validator: function (value) {
      //     return value.length <= 10
      //   }
      // }
    },
    photoUrl: {
      type: String,
      default: 'https://geographyandyou.com/images/user-profile.png',
      validate (value) {
        if (!validator.isURL(value)) {
          throw new Error('Invalid Photo URL')
        }
      }
    }
  },
  {
    timestamps: true
  }
)

//*mongoose method models
//only a  method to expire the token , cookie can also be expired
//use of cookies (add the token tio cookie) and send back to the user as the browser saves token
//this will be stored in key:cookie (value pair)

userSchema.methods.getJWT = async function () {
  const user = this
  const token = await jwt.sign(
    { _id: user._id },
    /* a secret key*/ 'AsishKumar',
    {expiresIn: '7d'}
  )
  return token
}
//* offloading password validation directly through here (a login Method)
userSchema.methods.validatePassword = async function (passwordInputUser) {
  const user = this
  const passwordHash = this.password
  const isPasswordValid = await bcrypt.compare(passwordInputUser, passwordHash)
  return isPasswordValid
}

//* Now we create a mongoose model and name should be capital

const User = mongoose.model('User', userSchema)
//*  -> Collection will be "users" (Mongoose pluralizes)

module.exports = { User }
