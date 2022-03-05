const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/userModel');

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = User.findById(id);
  return done(null, user);
});

const localVerify = async function (email, password, done) {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const newUser = await User.create({ email, password });
      return done(null, newUser);
    }
    const passMatch = await user.comparePassword(password, user.password);
    if (!passMatch) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    console.log(error);
  }
};

const localStrategy = new passportLocal.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  localVerify
);

passport.use('local', localStrategy);
