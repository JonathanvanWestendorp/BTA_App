const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.post('/', function (req, res) {
  const data = req.body;

  mongoose.connect('mongodb://localhost/function_calls', { useUnifiedTopology: true, useNewUrlParser: true });

  let FuncCall = require('./funcCallSchema');
  let newFuncCall = new FuncCall(data);

  newFuncCall.save(function(error) {
    if (error) {
      res.send(error);
    } else {
      console.log('Call saved successfully.');
      res.status(200)
      res.send();
    }
  });
});

router.get('/', function(req, res) {
  mongoose.connect('mongodb://localhost/function_calls', { useUnifiedTopology: true, useNewUrlParser: true });
  let FuncCall = require('./funcCallSchema');
  FuncCall.find({}, function (error, result) {
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