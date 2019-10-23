const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  imageUrl: { type: String, required: true }
})

const Image = mongoose.model('Thing', imageSchema);
module.exports = Image;