const express = require('express')
const reqRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const { User } = require('../models/user')

reqRouter.post("/", userAuth, async (req, res) => {
    const user = req.user
    //sending a connection request 
    res.send(user.firstName + "Sent the connection request");

})
module.exports = reqRouter