#!/bin/bash

APP_ROOT=$PWD

# For development with Fabric. Can be changed if necessary
nohup /home/mrjonathanvw/fabric/go/src/github.com/hyperledger/fabric-chaincode-evm/bin/fab3 > "$APP_ROOT"/var/app.log 2>"$APP_ROOT"/var/error.log &
echo "started fab3"
# Start database
nohup mongod --dbpath "$APP_ROOT"/server/data > "$APP_ROOT"/var/app.log 2>"$APP_ROOT"/var/error.log &
echo "started MongoDB"


# Start web application
nohup npm run dev > "$APP_ROOT"/var/app.log 2>"$APP_ROOT"/var/error.log &
(cd client && nohup npm run serve > "$APP_ROOT"/var/app.log 2>"$APP_ROOT"/var/error.log &)
echo "started web application"

# Start Caterpillar
nohup ganache-cli > "$APP_ROOT"/var/app.log 2>"$APP_ROOT"/var/error.log &
(cd caterpillar/prototype/caterpillar-core && nohup npm run start > "$APP_ROOT"/var/app.log 2>"$APP_ROOT"/var/error.log &)
(cd caterpillar/prototype/execution-panel && nohup npm run start > "$APP_ROOT"/var/app.log 2>"$APP_ROOT"/var/error.log &)
echo "started Caterpillar"
tail -f "$APP_ROOT"/var/app.log