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
  const id = req.body.id;
  mongoose.connect('mongodb://localhost/simulation_results', { useUnifiedTopology: true, useNewUrlParser: true });
  let simulationResult = require('./simulationResultSchema');
  simulationResult.find(id ? {_id: id} : {}, function (error, result) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });
      res.status(200).send(result);
    }
  });
});

router.delete("/", function(req, res) {
  const id = req.body.id;
  mongoose.connect('mongodb://localhost/simulation_results', { useUnifiedTopology: true, useNewUrlParser: true });
  let simulationResult = require('./simulationResultSchema');
  simulationResult.deleteOne({ _id: id }, function(err) {
    if (err) {
      res.status(500).send("Could not delete entry");
    } else {
      simulationResult.find({}, function (error, result) {
        if (error) {
          res.status(500).send(error);
        } else {
          res.status(200).send(result);
        }
      });
    }
  });
});

module.exports = router;