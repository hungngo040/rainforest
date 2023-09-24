/*
RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023B
Assessment: Assignment 3
Author: Group 21
*/
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');
// create schema
const VendorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true },
    maxlength: 15,
    minlength: 8,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9]+$/.test(value);
      },
      message: 'The password must contain only letters (lowercase and uppercase) and digits.'
    },
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
    profile_picture:{
      data: Buffer,
      contentType: String,

      message: 'The Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'

    },
    required: true,
    minlength: 8,
    maxlength: 20
  },
  profile_picture: {
    data: Buffer,
    contentType: String
  },

  Business_name: {
    type: String,
    required: true
  },
  Business_address: {
    type: String,
    required: true
  },


});


// hash the password
VendorSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  }
});
// Compare the password
VendorSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error('Password is mission, can not compare!');

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log('Error while comparing password!', error.message);
  }
};



VendorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Vendor', VendorSchema)



