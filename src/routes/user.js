const express = require('express')
const userRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const { ConnectionRequestModel } = require('../models/connectionRequest')
const { connection } = require('mongoose')
const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills'

//get all the pending connection request for the loggedIn user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user
    const connectionrequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: 'interested'
    }).populate('fromUserId', ['firstName', 'lastName'])

    res.json({ message: 'Data fetched Successfully', data: connectionrequest })
  } catch (error) {
    res.status(404).send('Error : ' + error.message)
  }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user
    //ravi=>anjali = accepted
    //anjali=>anyone => accepted (we just want to find what are the request related to anjali )
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' }
      ]
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA)
    if (!connectionRequest) {
      return res.json({
        message: 'the user has not sent or received any connection request'
      })
    }
      //now will just send the data of the from user id\
      //* this will help get the data of toUserid or fromuserId
    const data = connectionRequest.map(row => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId
      }
      return row.fromUserId
    })

    res.json({ message: 'the connecton list is below', data })
  } catch (error) {
    res.status(404).send('Error: ' + error.message)
  }
})

userR
module.exports = userRouter
