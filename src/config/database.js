const mongoose = require('mongoose')
//* if we wanna connect to a databse from cluster "/ add at last database name"
const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://asishkumar2418:1RuOBcHlxA4GyXOi@resumeprojectasu.kkalg7t.mongodb.net/committogether'
  )
}
module.exports = {
    connectDB
}


