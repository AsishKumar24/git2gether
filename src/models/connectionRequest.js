const mongoose = require('mongoose')
const { Schema } = mongoose

const connectionRquestSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true
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

connectionRquestSchema.index({ fromUserId: 1, toUserId: 1 })

connectionRquestSchema.pre('save', function (next) {
  const connectionRequest = this
  // Check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error('Cannot send connection request to yourself!')
  }
  next()
})

const ConnectionRequestModel = mongoose.model(
  'ConnectionReq',
  connectionRquestSchema
)
module.exports = { ConnectionRequestModel }
