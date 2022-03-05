const mongoose = require('mongoose');
const validator = require('validator');
const brcypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: {
      validator: function (e) {
        return validator.isEmail(e);
      },
      message: (props) => `${props.value} is not a email`,
    },
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await brcypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (
  enteredPassword,
  actualPassword
) {
  return await brcypt.compare(enteredPassword, actualPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
