const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  image: String
},
{
  timestamps: true
})

module.exports = mongoose.model('User', userSchema);