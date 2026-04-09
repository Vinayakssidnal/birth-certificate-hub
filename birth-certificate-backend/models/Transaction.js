const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  action_type: { type: String, enum: ["create", "approve", "verify"], required: true },
  gas_fee: { type: Number, default: 0.01 },
  certId: { type: Number },
  txHash: { type: String },
  block: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
