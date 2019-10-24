const express = require('express');
const postroutes = express.Router();
const Post = require('../models/Post');

// include CLOUDINARY:
const uploader = require('../configs/cloudinary-setup');

postroutes.post('/createNewPost', uploader.single("imageUrl"), (req, res, next) => {
 // console.log(req.body)
  const {caption, imagePost, currentUser} = req.body
  Post.create({
    caption,
    image: imagePost,
    owner: currentUser.username,
    likes: []
  }).then(newPost => {
    console.log("NEW POST!", newPost)
  //  if(newPost){
  //   res.status(200).json({message: "New post made successfully!"});
  //  }
  })
  .catch(err => console.log(err))
})


module.exports = postroutes