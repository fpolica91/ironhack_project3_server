const passport = require('passport');
const User = require('../../models/User');

passport.serializeUser((loggedInUser, done) => {
  done(null, loggedInUser._id)
});

passport.deserializeUser((userIdFromSession, done) => {

  User.findById(userIdFromSession)
  .then(fullUserDoc => done(null, fullUserDoc))
  .catch(err => done(err));
})