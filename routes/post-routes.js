const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

// include CLOUDINARY:
const uploader = require("../configs/cloudinary-setup");




router.get('/users', (req, res, _) => {
  User.find()
    .then(user => res.json(user))
    .catch(err => res.json(err))
})



router.post('/follow/:id', async (req, res, _) => {
  const { id } = req.params
  const { currentUser } = req.body
  const requesting_user = currentUser._id
  const requested_user = id
  User.findById(id, (err, user) => {
    if (user.followers.some(follower => follower.equals(requesting_user))) {
      const index = user.followers.indexOf(requested_user)
      user.followers.splice(index, 1)
      user.save((err, __user) => {
        if (err) {
          res.json({ success: false, message: "unexpcted error" })
        } else {

          User.findById(requesting_user, (err, user) => {
            if (user.following.some(followed => followed.equals(requested_user))) {
              const index = user.following.indexOf(requested_user)
              user.following.splice(index, 1)
              // res.json(u_ser)
              user.save((err, user) => {
                if (err) {
                  res.json({ success: false, message: "unexpected error" })
                } else {
                  res.json({
                    followers: __user.followers,
                    following: user.following,
                    message: "follow"
                  })
                }
              })
            }
          })
        }
      })
    } else {
      user.followers.push(requesting_user)
      user.save((err, __user) => {
        if (err) {
          res.json({ success: false, message: "unexpected error" })
        } else {
          User.findById(requesting_user, (err, user) => {
            user.following.push(requested_user)
            user.save((err, user) => {
              if (err) {
                res.json({ success: false, message: "unexpected error" })
              } else {
                res.json({
                  followers: __user.followers,
                  following: user.following,
                  message: ""

                })
              }
            })
          })
        }
      })
    }
  })
})




router.put("/updatePost/:id", async (req, res, _) => {
  const { id } = req.params

  if (!id) {
    res.json({ success: false, message: "cannot find post to edit" })
  } else {
    try {
      console.log(req.body)
      await Post.findOneAndUpdate({ _id: id }, {
        caption: req.body.caption,
        tags: req.body.tags
      })
        .then(post => {
          res.json({
            tags: post.tags,
            caption: post.caption
          })
        })
        .catch(err => {
          if (err) {
            res.json(err)
          }
        })
    } catch (err) {
      console.log(err)
    }
  }

})











router.post(
  "/createNewPost",
  uploader.single("imageUrl"),
  async (req, res, next) => {


    const { caption, imagePost, tags } = req.body;

    if (!imagePost || !req.user) {
      res.json({ success: false, message: "Loggin in is required to" })
    }

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
)

router.get("/createNewPost", async (req, res, _) => {

  // console.log(req.user);
  try {
    await Post.find({}, (err, data) => {
      if (err) {
        res.json({ success: false, message: err })
      } else {
        if (!data) {
          res.json({ success: false, message: "no post found" })
        }
      }
    })
      .populate('owner')
      .then(data => res.json(data))
  }
  catch (err) {
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
})

router.post("/update/:id", async (req, res, _) => {


  await Post.findById(req.params.id, (err, post) => {
    if (err) {
      res.json({ success: false, message: "Something went wrong" });
    } else {
      if (!post) {
        res.json({
          success: false,
          message: "Sorry that post doesn't exist"
        })
          .populate('owner')
      } else {
        User.findOne({ _id: req.body.currentUser._id }, (err, user) => {
          if (err) {
            res.json({ success: false, message: "Error while authenticating" });
          } else {
            if (!user) {
              res.json({ success: false, message: "You must be logged in" });
            }
          }

          // if (post.likes.some().equals(user._id)) 
          if (post.likes.some(like => like.equals(user._id))) {
            const index = post.likes.indexOf(user._id);
            post.likes.splice(index, 1);
            post.save(err => {
              if (err) {
                res.json({ success: false, message: "error" })
              } else {
                res.json(post)
              }
            })
          } else {
            post.likes.push(user._id);
            post.save((err) => {
              if (err) {
                res.json({ success: false, message: "Something went wrong" })
              } else {
                res.json(post)
              }
            });
          }
          console.log(req.user)
        });
      }
    }
  })

});

router.post('/delete/:id', (req, res, _) => {

  const { currentUser } = req.body
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      res.json({ success: false, message: "unexpected error" })
    } else {
      if (!post) {
        res.json({ success: false, message: "unable to find post" })
      }
      if (!post.owner.equals(currentUser._id)) {
        res.json({ success: false, message: "You can only delete your own post" })
      } else {
        if (post.owner.equals(currentUser._id)) {
          post.delete()
          res.json({ success: true, message: `successfully deleted ${post}` })
        }
      }
    }
  })
})

module.exports = router;



