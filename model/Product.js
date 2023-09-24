const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 20,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  category: {
    type: String,
    enum: ['Smartphone', 'Laptop', 'Acessories']
  }
});


module.exports = mongoose.model('Product', ProductSchema);