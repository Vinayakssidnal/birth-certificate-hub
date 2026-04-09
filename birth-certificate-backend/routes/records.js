const express = require("express");
const BirthRecord = require("../models/BirthRecord");
const Transaction = require("../models/Transaction");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

// POST /api/records/bulk-sync — Sync seed data from frontend
router.post("/bulk-sync", async (req, res) => {
  try {
    const { records, transactions } = req.body;
    if (!records || !transactions) {
      return res.status(400).json({ error: "Missing records or transactions" });
    }

    // Clear existing data
    await BirthRecord.deleteMany({});
    await Transaction.deleteMany({});

    // Prepare and insert records
    const recordsToInsert = records.map((r) => ({
      certId: r.id,
      fatherName: r.record.fatherName,
      motherName: r.record.motherName,
      babyName: r.record.babyName,
      birthDate: r.record.birthDate,
      birthTime: r.record.birthTime,
      gender: r.record.gender,
      hospitalAddress: r.record.hospitalAddress,
      permanentAddress: r.record.permanentAddress,
      doctorName: r.record.doctorName,
      status: r.status,
      txHash: r.txHash,
      approveTxHash: r.approveTxHash || null,
      approverAddress: r.approverAddress || null,
      creatorAddress: r.creatorAddress,
      createdAt: new Date(r.createdAt),
      approvedAt: r.approvedAt ? new Date(r.approvedAt) : null,
      block: r.block,
    }));

    await BirthRecord.insertMany(recordsToInsert);

    // Prepare and insert transactions
    const txsToInsert = transactions.map((t) => ({
      user_id: t.actor || "system-seed", // Use the actor address from frontend
      certId: t.certId,
      action_type: t.type,
      txHash: t.txHash,
      block: t.block,
      gas_fee: 0.01,
      timestamp: new Date(t.timestamp),
    }));

    await Transaction.insertMany(txsToInsert);

    res.json({ message: "Data synced successfully", recordsCount: recordsToInsert.length, transactionsCount: txsToInsert.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/records — Create a birth record (hospital only)
router.post("/", authMiddleware, requireRole("hospital"), async (req, res) => {
  try {
    const record = await BirthRecord.create(req.body);

    await Transaction.create({
      user_id: req.user.userId,
      action_type: "create",
      gas_fee: 0.01,
      certId: record.certId,
      txHash: req.body.txHash || "",
      block: req.body.block || 0,
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/records — List all records
router.get("/", authMiddleware, async (req, res) => {
  try {
    const records = await BirthRecord.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/records/:certId — Get single record
router.get("/:certId", async (req, res) => {
  try {
    const record = await BirthRecord.findOne({ certId: Number(req.params.certId) });
    if (!record) return res.status(404).json({ error: "Record not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/records/:certId/approve — Approve a record (registrar only)
router.put("/:certId/approve", authMiddleware, requireRole("registrar"), async (req, res) => {
  try {
    const record = await BirthRecord.findOne({ certId: Number(req.params.certId) });
    if (!record) return res.status(404).json({ error: "Record not found" });

    record.status = "Approved";
    record.approvedAt = new Date();
    record.approveTxHash = req.body.txHash || "";
    record.approverAddress = req.user.address;
    await record.save();

    await Transaction.create({
      user_id: req.user.userId,
      action_type: "approve",
      gas_fee: 0.01,
      certId: record.certId,
      txHash: req.body.txHash || "",
      block: req.body.block || 0,
    });

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/records/:certId/verify — Verify a record (public)
router.post("/:certId/verify", authMiddleware, async (req, res) => {
  try {
    const record = await BirthRecord.findOne({ certId: Number(req.params.certId) });
    if (!record) return res.status(404).json({ error: "Record not found" });

    await Transaction.create({
      user_id: req.user.userId,
      action_type: "verify",
      gas_fee: 0.01,
      certId: record.certId,
      block: req.body.block || 0,
    });

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
