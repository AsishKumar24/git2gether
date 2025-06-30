const mongoose = require('mongoose')
//* if we wanna connect to a databse from cluster "/ add at last database name"
const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://asishkumar:xkhGCZbgE02Lpk5G@git2gether.adydiee.mongodb.net/committogether'
  )
}
module.exports = {
    connectDB
}


