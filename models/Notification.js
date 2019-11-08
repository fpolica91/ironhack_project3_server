const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  // example -> liked, commented, saw, etc
  event: String,

  // to what  post , profile, etc
  body: String,
  toWhat: String,
  toWho: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  fromWho: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: {
    type: Date,
    default: Date.now()
  },
  seen: {
    type: Boolean,
    default: false
  }
})


const Notification = mongoose.model("Notification", notificationSchema)
module.exports = Notification
