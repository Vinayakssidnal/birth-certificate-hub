const express = require("express");
const Transaction = require("../models/Transaction");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// GET /api/transactions — List transactions (optionally filter by user_id)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter = {};
    if (req.query.user_id) filter.user_id = req.query.user_id;
    const transactions = await Transaction.find(filter).sort({ timestamp: -1 }).limit(100);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
