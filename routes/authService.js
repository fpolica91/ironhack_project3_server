const express = require('express');

const router = express.Router();

const User = require('../models/User');

const bcrypt = require('bcryptjs');

const passport = require('passport');

// include CLOUDINARY:
const uploader = require('../configs/cloudinary-setup');

router.post('/auth/signup', uploader.single("imageUrl"), (req, res ,next) => {
  console.log(req.body);
  const {username, email, password, imagePost} = req.body;

  if(username === "" || password === ""){
res.status(401).json({message: "All field need to be filled and password must contain a number!"})
return;
  }

  User.findOne({username})
  .then(foundUser => {
    if(foundUser !== null){
      res.status(401).json({message: "A user with the same username is already registered! "});
      return;
    }

    const bcryptsalt = 10;
    const salt = bcrypt.genSaltSync(bcryptsalt);
    const encryptedPassword = bcrypt.hashSync(password, salt);
    const imageUrl = imagePost

    User.create({username, email, encryptedPassword, imageUrl})
    .then(userDoc => {

  // if all good, log in the user automatically
          // "req.login()" is a Passport method that calls "serializeUser()"
          // (that saves the USER ID in the session)

      req.login(userDoc, (err) => {
        if(err){
          res.status(401).json({message: "Something happened logging in after the signup"})
          return;
        }

        userDoc.encryptedPassword = undefined;
        res.status(200).json({userDoc});
      })
    })
    .catch(err => next(err)); // close User.create()
  })
  .catch(err => next(err));// close User.findOne()
})

router.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, userDoc, failureDetails) => {
    if(err){
      res.status(500).json({message: "Something went wrong with login"})
    }
    if(!userDoc){
      res.status(401).json(failureDetails)
    }

    req.login(userDoc, (err)=>{
      if(err){
        res.status(500).json({message: 'Something went wrong with getting user object from DB'})
        return;
      }

      userDoc.encryptedPassword = undefined;
      res.status(200).json({ userDoc })
    })
  })(req, res, next);
})

router.delete('/auth/logout', (req, res, next) => {
  req.logout();

  res.json({userDoc: null})
})

router.get('/auth/loggedin', (req, res, next) => {
  if(req.user){
    req.user.encryptedPassword = undefined;

    res.status(200).json({userDoc: req.user})
  }else{
    res.status(401).json({userDoc: null})
  }
})

module.exports = router;