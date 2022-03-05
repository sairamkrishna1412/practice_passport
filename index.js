const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');

require('./passport');

mongoose.connect('mongodb://localhost:27017/passportTest', (err) => {
  if (err) {
    console.log('Error connecting to mongoose');
  }
  console.log('Connected to mongodb successfully');
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({ maxAge: 10 * 24 * 60 * 60 * 1000, keys: ['shiva'] }));

app.use(passport.initialize());
app.use(passport.session());

app.post(
  '/signup',
  (req, res, next) => {
    console.log('trig');
    next();
  },
  passport.authenticate('local', { failureMessage: 'Could not signup!' }),
  (req, res, next) => {
    console.log('trig2');
    return res.status(200).json({
      success: true,
      message: `Signed up successfully as ${req.user.email}`,
      data: req.user,
    });
  }
);

app.post(
  '/login',
  passport.authenticate('local', { failureMessage: 'Incorrect credentials!' }),
  (req, res, next) => {
    return res.status(200).json({
      success: true,
      message: `Logged in successfully as ${req.user.email}`,
      data: req.user,
    });
  }
);

app.get(
  '/protected',
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({
      success: false,
      message: 'You are not logged in. please log in first.',
    });
  },
  (req, res, next) => {
    return res.status(200).json({
      success: true,
      message: 'You have access to this route!',
    });
  }
);

app.post('/logout', (req, res, next) => {
  req.logout();
  return res.status(200).json({
    success: true,
    message: 'Logout succesful',
  });
});

app.get('/user', (req, res, next) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  }
});

const PORT = 2000;
app.listen(PORT, (err) => {
  if (err) {
    console.log('Something went wrong.', err);
  }
  console.log(`App running on port ${2000}`);
});
