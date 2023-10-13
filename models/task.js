const {model, Schema} = require('mongoose')

const Task = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String, 
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'DONE'],
    default: 'PENDING'
  },
  dueDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
})

module.exports = model("Task", Task);