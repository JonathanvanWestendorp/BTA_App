const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.post('/', function (req, res) {
  const data = req.body.data;
  mongoose.connect('mongodb://localhost/function_calls');

  let FuncCall = require('./funcCallSchema');

  let newFuncCall = new FuncCall(data);

  newFuncCall.save(function(err) {
    if (err) throw err;

    console.log('Call saved successfully.');
    res.status(200);
    res.send();
  });
});

module.exports = router;