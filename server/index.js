const cors = require('cors');
const solc = require('solc');
const axios = require('axios');
const express = require('express');
const abi = require('web3-eth-abi');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const app = express();

const port = 3000;

app.use(cors());
app.use(busboy());
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: false
}));

app.post('/compile', function (req, res) {
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

app.post('/execute', function (req, res) {
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
    axios.post(endpoint, sendTx).then(function (txRes) {
        console.log(txRes.data.result);
        const getResult = {
            jsonrpc: "2.0",
            method: "eth_getTransactionReceipt",
            id: 1,
            params: {
                data: txRes.data.result
            }
        };
        axios.post(endpoint, getResult).then(function (hashRes) {
            res.set({
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            });
            console.log(hashRes.data.result);
            res.send(hashRes.data.result);
        });

    });
});

// app.post('/deploy', function (req, res) {
//     const byteCode = req.body.byteCode;
//     const rpcPort = req.body.rpcPort;
//
//     const endpoint = `http://localhost:${rpcPort}`;
//
//     const result = sendTransaction(endpoint, null, byteCode);
//     const newAddress = getReceipt(endpoint, result).contractAddress;
//     res.set({
//         "Access-Control-Allow-Origin": "*"
//     });
//     res.send(newAddress);
// });

app.listen(port, () => console.log(`Server started on port ${port}`));