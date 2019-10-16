const express = require('express');

const router = express.Router();

const User = require('../models/User');

const bcrypt = require('bcryptjs');

const passport = require('passport');

router.post('/auth/signup', (req, res ,next) => {
  const {username, password, campus, course} = req.body;

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

    User.create({username, encryptedPassword, campus, course, image})
    .then(userDoc => {

      req.login(userDoc, (err) => {
        if(err){
          res.status(401).json({message: "Something happened logging in after the signup"})
          return;
        }

        userDoc.encryptedPassword = undefined;
        res.status(200).json({userDoc});
      })
    })
    .catch(err => next(err));
  })
  .catch(err => next(err));
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
      res.status(200).json({userDoc})
    })
  })(req, res, next);
})

router.delete('/auth/logout', (req, res, next) => {
  req.logout();

  res.json({userDoc: null})
})

router.get('auth/loggedin', (req, res, next) => {
  if(req.user){
    req.user.encryptedPassword = undefined;

    res.status(200).json({userDoc: req.user})
  }else{
    res.status(401).json({userDoc: null})
  }
})

module.exports = router;