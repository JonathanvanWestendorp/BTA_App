const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let simulationResultSchema = new Schema({
  timestamp: Date,
  iterations: Number,
  duration: Number,
  created_at: Date,
  updated_at: Date
});

simulationResultSchema.pre('save', function(next) {
  const currentDate = new Date();

  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

let simulationResult = mongoose.model('simulationResult', simulationResultSchema);

module.exports = simulationResult;