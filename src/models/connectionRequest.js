const mongoose = require('mongoose')
const { Schema } = mongoose

const connectionRquestSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    status: {
      type: String,
      //if status wanna be only 4 things apart fromt hese everything else will give error we use Enum
      enum: {
        values: ['ignored', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is incorrect status type`
      }
    }
  },
  {
    timestamps: true
  }
)

//mongoose.Schema.Types.ObjectId = 'this field will store an ObjectId'
//mongoose.Types.ObjectId = 'this is an ObjectId value'
//❗ This does not create an ObjectId — it just tells Mongoose:
// "Hey, this field will store an ObjectId value"
// ✅ It's a SchemaType — a configuration, not a value.

//*MongoDB can use a B-Tree structure to jump to the correct value — like binary search — and return the result in milliseconds.
//? 1 means ascending order and -1 means descending order
connectionRquestSchema.index({ fromUserId: 1, toUserId: 1 })

connectionRquestSchema.pre('save', function (next) {
  const connectionRequest = this
  // Check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error('Cannot send connection request to yourself!')
  }
  //a middleware so its comulsory to keep it here
  next()
})

const ConnectionRequestModel = mongoose.model(
  'ConnectionReq',
  connectionRquestSchema
)
module.exports = { ConnectionRequestModel }
