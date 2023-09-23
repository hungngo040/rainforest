const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt')

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
      required: true,
<<<<<<< HEAD
      minlength:8,
=======
        minlength:8,
>>>>>>> 424187cbd4ee8636ebb30b591569984a5f5a0ae0
      maxlength:20
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

CustomerSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  }
});
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
<<<<<<< HEAD



=======
  
>>>>>>> 424187cbd4ee8636ebb30b591569984a5f5a0ae0
module.exports = mongoose.model('Customer', CustomerSchema)
