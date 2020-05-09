const solc = require('solc');
const axios = require('axios');
const express = require('express');
const abi = require('web3-eth-abi');
const busboy = require('connect-busboy');
const app = express();

const ledgerEndpoint = "http://localhost:5000"
const port = process.env.PORT || 3000;

app.use(busboy());
app.use(express.urlencoded({
    extended: false
}));

app.post('/compile', function (req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function (_, file, filename) {
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
    const params = req.body.params.replace(/\s/g, '').split(",");
    const paramTypes = req.body.paramTypes;
    const functionName = req.body.functionName;
    const contractAddress = req.body.contractAddress;

    const FunctionSignature = functionName + "(" + paramTypes + ")";
    const encFunctionSignature = abi.encodeFunctionSignature(FunctionSignature);

    var encParameters;
    if (params.length > 1) {
        encParameters = abi.encodeParameters(paramTypes.replace(/\s/g, '').split(","), params);
    } else {
        encParameters = abi.encodeParameter(paramTypes, params[0]);
    }

    const encodedCall = encFunctionSignature + encParameters.replace('0x','');

    const rpcSendTransaction = {
        jsonrpc: "2.0",
        method: "eth_sendTransaction",
        id: 1,
        params: {
            to: contractAddress,
            data: encodedCall
        }
    };

    axios.post(ledgerEndpoint, rpcSendTransaction).then(function (txRes) {
        const receiptHash = txRes.data.result;
        const rpcGetreceipt = {
            jsonrpc: "2.0",
            method: "eth_getTransactionReceipt",
            id: 1,
            params: receiptHash
        };
        axios.post(ledgerEndpoint, rpcGetreceipt).then(function (receiptRes) {
            console.log(receiptRes.data);
            res.set({
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            });
            res.send(receiptRes.data);
        })
        .catch(function (error) {
            console.error(error);
        });

    })
    .catch(function (error) {
        console.error(error);
    });

});

app.post('/deploy', function (req, res) {
    bytecode = req.body.bytecode;
    const deploy = {
        jsonrpc: "2.0",
        method: "eth_sendTransaction",
        id: 1,
        params: {
            data: bytecode
        }
    };
    axios.post(ledgerEndpoint, deploy).then(function (contractRes) {
        const contractAddress = contractRes.data;
        res.set({
            "Access-Control-Allow-Origin": "*"
        });
        res.send(contractAddress);
    });
});


app.listen(port, () => console.log(`Server started on port ${port}`));