const jwt = require('jsonwebtoken')
const { User } = require('../models/user')

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies
    if (!token) {
      return res.status(401).send("token is not valid!")
    }
    const decodedSentHidden = await jwt.verify(token, 'AsishKumar')
    const { _id } = decodedSentHidden
    const user = await User.findById(_id)
    if (!user) {
      throw new Error('no user present in DB')
    }
    req.user = user
    next()
  } catch (error) {
    res.status(400).send('ERROR: ' + error.message)
  }
}
module.exports = {
  userAuth
}
