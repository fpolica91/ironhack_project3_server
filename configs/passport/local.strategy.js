const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy({
  usernameField: 'username'
}, (username, password, next) => {

  User.findOne({ username })
    .then(foundUser => {
      if (!foundUser) {
        return next(null, false, { message: "Incorrect email" })
      }
      if (!bcrypt.compareSync(password, foundUser.encryptedPassword)) {
        return next(null, false, { message: "Incorrect password" })
      }
      return next(null, foundUser, { message: "Logged in successfully" })
    })
    .catch(err => next(err))
}))






// passport.use(new LocalStrategy((username, password, next) => {
//   User.findOne({ username }, (err, user) => {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return next(null, false, { message: "Incorrect username" });
//     }
//     if (!bcrypt.compareSync(password, user.password)) {
//       return next(null, false, { message: "Incorrect password" });
//     }
//     return next(null, user);
//   })
//     .catch(err => next(err))
// }))