/*
RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023B
Assessment: Assignment 3
Author: Group 21
*/

const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt')
// create schema
const CustomerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    validate: {
      validator: function (value) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
        return regex.test(value);
      },

      required: true,

      minlength:8,

      maxlength:20
      },
    name: {
      type: String,
      required: true,

      message: 'The password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'

    },
    required: true,
    minlength: 8,
    maxlength: 20
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }

});
// hash the password
CustomerSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  }
});
// Compare the password
CustomerSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error('Password is mission, can not compare!');

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log('Error while comparing password!', error.message);
  }
};



CustomerSchema.plugin(passportLocalMongoose);



module.exports = mongoose.model('Customer', CustomerSchema)
