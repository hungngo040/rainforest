
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var User = new Schema({
    username: {
        type: String,
        required: true
    },
    password:{
        type: String,
        validate: {
          validator: function(value) {
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
            return regex.test(value);
          },
          message: 'The value must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
        },
        required: true
        },
})
  
User.plugin(passportLocalMongoose);
  
module.exports = mongoose.model('User', User)