const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let funcCallSchema = new Schema({
  timestamp: Date,
  chainId: String,
  contractAddress: String,
  contractName: String,
  functionName: String,
  input: Array,
  rpcResponse: Object,
  rpcPort: Number,
  duration: Number,
  created_at: Date,
  updated_at: Date
});

funcCallSchema.pre('save', function(next) {
  const currentDate = new Date();

  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

let FuncCall = mongoose.model('FuncCall', funcCallSchema);

module.exports = FuncCall;