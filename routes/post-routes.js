const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

// include CLOUDINARY:
const uploader = require("../configs/cloudinary-setup");

router.post(
  "/createNewPost",
  uploader.single("imageUrl"),
  async (req, res, next) => {
    const { caption, imagePost, tags } = req.body;
    try {
      await Post.create({
        caption,
        image: imagePost,
        owner: req.user,
        likes: [],
        tags
      })
        .then(data => res.json(data))
        .catch(err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }
);

router.get("/createNewPost", async (req, res, _) => {
  console.log(req.user);

    try{
    await Post.find({},(err,data)=>{
      if(err) {
        res.json({success: false, message:err})
      }else{
        if(!data){
          res.json({success: false, message: "no post found"})
        }
      }
    })
    .populate('owner')
    .then(data => res.json(data))
  } 
  catch(err){
    console.log(error)
  }
  
  

  // try {
  //   await Post.find()
  //     .populate("owner")
  //     .then(data => res.json(data))
  //     .catch(err => res.json(err));
  // } catch (err) {
  //   console.log(err);
  // }
});

router.post("/update/:id", (req, res, _) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      res.json({ success: false, message: "Something went wrong" });
    } else {
      if (!post) {
        res.json({
          success: false,
          message: "Sorry that post doesn't exist"
        });
      } else {
        User.findOne({ _id: req.body.currentUser._id }, (err, user) => {
          if (err) {
            res.json({ success: false, message: "Error while authenticating" });
          } else {
            if (!user) {
              res.json({ success: false, message: "You must be logged in" });
            }
          }

          if (post.likes.includes(user._id)) {
            const index = post.likes.indexOf(user._id);
            post.likes.splice(index, 1);
            post.save();
            res
              .status(401)
              .json({ success: false, message: "you already liked this post" });
          } else {
            post.likes.push(user._id);
            post.save();
          }
        });
      }
    }
  });
});

module.exports = router;
