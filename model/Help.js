const mongoose = require('mongoose')

const HelpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  query: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Help', HelpSchema)