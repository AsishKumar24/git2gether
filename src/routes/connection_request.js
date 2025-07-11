const express = require('express')
const reqRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const { User } = require('../models/user')
const { ConnectionRequestModel } = require('../models/connectionRequest')
//:userid i of the user u are interested
reqRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id
      const toUserId = req.params.toUserId
      const status = req.params.status

      const allowedStatus = ['ignored', 'interested']
      if (!allowedStatus.includes(status)) {
        throw new Error('The value is neither ignored nor accepted')
      }
      // A can send connection request to B
      //and if B is also sending the connection request to A then its a match

      //and a corner case to not send the request once again
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        //* another method to use cross check whether it has the connection request
        //will return a boolean
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId }
        ]
      })
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: 'the connection request is already present' })
      }
      //!crosscheck fro the to user id it should be present in the database pf user collection
      const toUser = await User.findById(toUserId)
      if (!toUser) {
        return res
          .status(400)
          .json({ message: 'the user id is not present in this website' })
      }

      const connectionReq = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status
      })
      const data = await connectionReq.save()
      res.json({
        message:
          req.user.firstName + ' is ' + status + ' ummah ' + toUser.firstName,
        data
      })
    } catch (error) {
      res.status(400).send('Error : ' + error.message)
    }
  }
)

reqRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user
      const { status, requestId } = req.params

      const allowedStatus = ['accepted', 'rejected']
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: 'Status not allowed!' })
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        //!check later for any invalidations or any request
        toUserId: loggedInUser._id,
        status: 'interested'
      })
      if (!connectionRequest) {
        return res.status(404).json({ message: 'Connection request not found' })
      }

      connectionRequest.status = status

      const data = await connectionRequest.save()

      res.json({ message: 'Connection request ' + status, data })
    } catch (err) {
      res.status(400).send('ERROR: ' + err.message)
    }
  }
)
module.exports = reqRouter
