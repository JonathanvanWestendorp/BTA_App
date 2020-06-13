const axios = require('axios');
const express = require('express');
const abi = require('web3-eth-abi');

const router = express.Router();

router.post('/', function (req, res) {
  const params = req.body.input.replace(/\s/g, '').split(",");
  const paramTypes = req.body.types;
  const functionName = req.body.name;
  const contractAddress = req.body.address;
  const rpcPort = req.body.port;

  const endpoint = `http://localhost:${rpcPort}`;

  const FunctionSignature = functionName + "(" + paramTypes + ")";
  const encFunctionSignature = abi.encodeFunctionSignature(FunctionSignature);

  let encParameters;
  if (params.length > 1) {
    encParameters = abi.encodeParameters(paramTypes, params);
  } else {
    encParameters = abi.encodeParameter(paramTypes[0], params[0]);
  }

  const encodedCall = encFunctionSignature + encParameters.replace('0x','');

  const sendTx = {
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    id: 1,
    params: {
      to: contractAddress,
      data: encodedCall
    }
  };
  const hrstart = process.hrtime();
  axios.post(endpoint, sendTx).then(function (txRes) {
    if (txRes.data.error) {
      res.send({error: txRes.data.error.message});
      return;
    }
    const getResult = {
      jsonrpc: "2.0",
      method: "eth_getTransactionReceipt",
      id: 1,
      params: txRes.data.result
    };
    axios.post(endpoint, getResult).then(function (hashRes) {
      const hrend = process.hrtime(hrstart);
      const total = hrend[0] * 1000 + hrend[1] / 1000000;
      res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });
      res.send({
        rpcResponse: hashRes.data.result,
        timestamp: hashRes.headers.date,
        duration: total
      });
    });
  });
});

module.exports = router;