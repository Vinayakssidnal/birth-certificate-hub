const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true, lowercase: true },
  role: { type: String, enum: ["hospital", "registrar", "public"], default: "public" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
