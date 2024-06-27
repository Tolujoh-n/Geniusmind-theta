const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Create or fetch a user
router.post("/", async (req, res) => {
  const { walletID, username } = req.body;

  try {
    let user = await User.findOne({ walletID });

    if (!user) {
      user = new User({ walletID, username });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
