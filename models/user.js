const { model, Schema } = require('mongoose')

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  hash: {
    type: String,
    required: true
  }, 
  salt: {
    type: String,
    required: true
  }
})

module.exports = model('User', UserSchema);