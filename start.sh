#!/bin/bash

mongod --fork --logpath "$PWD"/server/data/mongod.log --dbpath "$PWD"/server/data
