const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  comment: {
    type: String,
  }
}, {
  timestamps: true
})




const postSchema = new Schema({
  caption: {
    type: String,
  },
  image: {
    type: String,
    required: true
  },

  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  tags: [String],
  owner: {
    type: Schema.Types.ObjectId, ref: "User"
  },

  comments: [Comment]
}, {
  timestamps: true
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;