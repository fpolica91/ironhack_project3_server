const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: /^.+@.+\..+$/
  },

  encryptedPassword: {
    type: String,
    required: true
  },
  imageUrl: String,
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }]
},

  {
    timestamps: true
  })

module.exports = mongoose.model('User', userSchema);