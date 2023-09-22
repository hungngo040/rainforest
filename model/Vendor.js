
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
const VendorSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      index: { unique: true },
      maxlength: 15,
      minlength: 8,
      validate: {
        validator: function(value) {
          return /^[a-zA-Z0-9]+$/.test(value);
        },
        message: 'The password must contain only letters (lowercase and uppercase) and digits.'
      },
    },
    password:{
      type: String,
      validate: {
        validator: function(value) {
          const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
          return regex.test(value);
        },
        message: 'The Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
      },
      required: true
      },
    
    Business_name: {
      type: String,
      required: true
    },
    Business_address: {
      type: String,
      required: true
    },
    profile_picture:{
      type: Buffer, // Use the Buffer type to store binary data
      required: true
    }
  
});
  
VendorSchema.plugin(passportLocalMongoose);
  
module.exports = mongoose.model('Vendor', VendorSchema)