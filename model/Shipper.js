const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt')
const ShipperSchema = new mongoose.Schema({
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
      minlength:8,
      maxlength:20
      },
  
    assigned_distribution_hub: {
      type: String,
      enum: ['Hanoi', 'Danang', 'HoChiMinh']
    }
  
  });
ShipperSchema.pre('save', function (next) {
    if (this.isModified('password')) {
      bcrypt.hash(this.password, 8, (err, hash) => {
        if (err) return next(err);
  
        this.password = hash;
        next();
      });
    }
  });
 ShipperSchema.methods.comparePassword = async function (password) {
    if (!password) throw new Error('Password is mission, can not compare!');
  
    try {
      const result = await bcrypt.compare(password, this.password);
      return result;
    } catch (error) {
      console.log('Error while comparing password!', error.message);
    }
  };


  ShipperSchema.plugin(passportLocalMongoose);



module.exports = mongoose.model('Shipper', ShipperSchema)