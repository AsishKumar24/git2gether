const mongoose = require('mongoose')
//* if we wanna connect to a databse from cluster "/ add at last database name"
const connectDB = async () => {
  await mongoose.connect(
    ''
  )
}
module.exports = {
    connectDB
}


