const mongoose = require("mongoose");

const birthRecordSchema = new mongoose.Schema({
  certId: { type: Number, unique: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  babyName: { type: String, required: true },
  birthDate: { type: String, required: true },
  birthTime: { type: String, required: true },
  gender: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  doctorName: { type: String, required: true },
  hospitalAddress: { type: String, required: true },
  txHash: { type: String },
  block: { type: Number, default: 0 },
  creatorAddress: { type: String },
  status: { type: String, enum: ["Pending", "Approved"], default: "Pending" },
  approveTxHash: { type: String },
  approverAddress: { type: String },
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
});

// Auto-increment certId
birthRecordSchema.pre("save", async function (next) {
  if (!this.certId) {
    const last = await this.constructor.findOne().sort({ certId: -1 });
    this.certId = last ? last.certId + 1 : 1001;
  }
  next();
});

module.exports = mongoose.model("BirthRecord", birthRecordSchema);
