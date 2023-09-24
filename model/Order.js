const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1
    },
    price: {
      type: Number,
      default: 0
    }
  }],
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  address: {
    type: String,
    required: true
  },
  distributionHub: {
    type: String,
    required: true,
    enum: ['Hanoi, Da Nang, Ho Chi Minh']
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Active', 'Delivered', 'Cancelled'],
  }
})

module.exports = mongoose.model('Order', OrderSchema)