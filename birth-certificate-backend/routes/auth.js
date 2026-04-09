const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "birth_hub_jwt_secret_change_me";

// POST /api/auth/wallet-login
router.post("/wallet-login", async (req, res) => {
  try {
    const { address, role } = req.body;
    if (!address) return res.status(400).json({ error: "Wallet address is required" });

    const validRoles = ["hospital", "registrar", "public"];
    const userRole = validRoles.includes(role) ? role : "public";

    let user = await User.findOne({ address: address.toLowerCase() });
    if (!user) {
      user = await User.create({ address: address.toLowerCase(), role: userRole });
    } else {
      user.role = userRole;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, address: user.address, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, user: { address: user.address, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
