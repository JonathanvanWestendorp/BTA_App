const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userTask = require('./userTaskSchema').schema;

let singleSimulationSchema = new Schema({
  userTasks: [userTask],
  created_at: Date,
  updated_at: Date
});

singleSimulationSchema.pre('save', function(next) {
  const currentDate = new Date();

  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

let singleSimulation = mongoose.model('singleSimulation', singleSimulationSchema);

module.exports = singleSimulation;