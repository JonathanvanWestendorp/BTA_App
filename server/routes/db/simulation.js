const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.post('/', function (req, res) {
  const data = req.body;

  mongoose.connect('mongodb://localhost/simulation_results', { useUnifiedTopology: true, useNewUrlParser: true });
  let simulationResult = require('./simulationResultSchema');
  let newSimulationResult = new simulationResult(data);

  newSimulationResult.save(function(error) {
    if (error) {
      res.send(error);
    } else {
      console.log('Simulation result saved successfully.');
      res.status(200);
      res.send();
    }
  });
});

router.get('/', function(req, res) {
  mongoose.connect('mongodb://localhost/simulation_results', { useUnifiedTopology: true, useNewUrlParser: true });
  let simulationResult = require('./simulationResultSchema');
  simulationResult.find({}, function (error, result) {
    if (error) {
      res.send(error);
    } else {
      res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });
      res.send(result);
    }
  });
});

module.exports = router;