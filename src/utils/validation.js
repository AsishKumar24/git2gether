const validator = require('validator')
const validateSignUpData = req => {
  const { firstName, lastName, emailId, password } = req.body
  if (!firstName || !lastName) {
    throw new Error('there is no name')
  } else if (!validator.isEmail(emailId)) {
    throw new Error('this is nopt correct email address')
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('not a strong password')
  }
}

const validateEditProfileData = req => {


    const Allowed_updates = ['gender', 'about', 'age', 'skills', 'photoUrl']
    const isUpdateAllowed = Object.keys(req.body).every(key =>
      Allowed_updates.includes(key)
    )
    return isUpdateAllowed;

}
module.exports = {
    validateSignUpData,
    validateEditProfileData

}
