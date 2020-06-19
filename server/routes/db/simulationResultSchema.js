const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const singleSimulation = require('./singleSimulationSchema').schema;

let simulationResultSchema = new Schema({
  simulations: [singleSimulation],
  timestamp: Date,
  iterations: Number,
  duration: Number,
  created_at: Date,
  updated_at: Date,
  name: String
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