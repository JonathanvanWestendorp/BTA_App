const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userTaskSchema = new Schema({
  taskId: String,
  input: Array,
  duration: Number,
  receipt: Array,
  created_at: Date,
  updated_at: Date
});

userTaskSchema.pre('save', function(next) {
  const currentDate = new Date();

  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

let userTask = mongoose.model('userTask', userTaskSchema);

module.exports = userTask;