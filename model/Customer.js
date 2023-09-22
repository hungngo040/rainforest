const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
const CustomerSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      index: { unique: true }
    },
    password:{
      type: String,
      validate: {
        validator: function(value) {
          const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
          return regex.test(value);
        },
        message: 'The password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
      },
      required: true
      },
    profile_picture: {
      type: Number
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

CustomerSchema.plugin(passportLocalMongoose);
  
module.exports = mongoose.model('Customer', CustomerSchema)