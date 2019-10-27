const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  caption: {
    type: String,
   
  },
  image: {
    type: String,
    required: true
  },
  // owner: String,
  likes: {
      type:[{type: Schema.Types.ObjectId, ref:"User"}],
      unique: true
  },
  tags:[String],
  owner: {
    type: Schema.Types.ObjectId, ref: "User"
  }
}, {
  timestamps: true
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;