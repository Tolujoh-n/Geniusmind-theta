const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const User = require("../models/User");

// Endpoint to handle wallet connection
router.post("/connect-wallet", async (req, res) => {
  const { walletID } = req.body;

  if (!walletID) {
    return res.status(400).json({ error: "Wallet ID is required" });
  }

  try {
    // Save the walletID to the database if not already saved
    let user = await User.findOne({ walletID });
    if (!user) {
      user = new User({ walletID });
      await user.save();
    }

    res.json({ address: walletID });
  } catch (error) {
    console.error("Error connecting wallet:", error);
    res.status(500).json({ error: "Error connecting wallet" });
  }
});

module.exports = router;
