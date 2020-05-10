const axios = require('axios');
const express = require('express');

const router = express.Router();

router.post('/', function (req, res) {
  const byteCode = req.body.byteCode;
  const rpcPort = req.body.rpcPort;

  const endpoint = `http://localhost:${rpcPort}`;

  const deployContract = {
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    id: 1,
    params: {
      data: byteCode
    }
  };
  axios.post(endpoint, deployContract).then(function (contractRes) {
    const getResult = {
      jsonrpc: "2.0",
      method: "eth_getTransactionReceipt",
      id: 1,
      params: contractRes.data.result
    };
    axios.post(endpoint, getResult).then(function (hashRes) {
      res.set({
        "Access-Control-Allow-Origin": "*"
      });
      res.send(hashRes.data.result.contractAddress);
    });
  });
});

module.exports = router;