const solc = require('solc');
const express = require('express');

const router = express.Router();

router.post('/', function (req, res) {
  req.pipe(req.busboy);
  req.busboy.on("file", function (_, file, filename) {
    file.on("data", function(contents) {
      let chunk = contents.toString();
      const input = {
        language: 'Solidity',
        sources: {
          [filename]: {
            content: chunk
          }
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
      };
      const output = JSON.parse(solc.compile(JSON.stringify(input)));
      res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });
      res.send(output);
    });
  });
});

module.exports = router;