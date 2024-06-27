const User = require("../models/User");

exports.createUser = async (req, res) => {
  const { walletID, username } = req.body;
  try {
    const existingUser = await User.findOne({ walletID });
    if (existingUser) {
      return res.status(200).json(existingUser);
    }
    const user = new User({ walletID, username });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

exports.getUser = async (req, res) => {
  const { walletID } = req.params;
  try {
    const user = await User.findOne({ walletID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};
