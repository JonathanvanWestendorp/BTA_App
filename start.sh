#!/bin/bash

APP_ROOT=$PWD

echo "Sleeping in between commands to ensure smooth startup.."

# For development with Fabric. Can be changed if necessary
echo "Starting fab3"
/home/mrjonathanvw/fabric/go/src/github.com/hyperledger/fabric-chaincode-evm/bin/fab3 &
sleep 2
echo "Started fab3"

# Start database
echo "Starting MongoDB"
mongod --dbpath "$APP_ROOT"/server/data &
sleep 5
echo "Started MongoDB"


# Start web application
echo "Starting web application"
npm run dev &
(cd client && npm run serve &)
sleep 5
echo "Started web application"

# Start Caterpillar
#echo "Starting Caterpillar"
#sleep 3
#(cd caterpillar/prototype/caterpillar-core && npm run start &)
#(cd caterpillar/prototype/execution-panel && npm run start &)
#sleep 5
#echo "started Caterpillar"