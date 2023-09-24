
/*
RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023B
Assessment: Assignment 3
Author: Group 21
*/

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

  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  category: {
    type: String,
    enum: ['Smartphone', 'Laptop', 'Acessories']
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    reference: 'Vendor',
    required: true,
  },
});

module.exports = mongoose.model('Product', ProductSchema);

