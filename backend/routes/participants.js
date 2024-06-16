// routes/participants.js
const express = require("express");
const router = express.Router();
const { QuizParticipant } = require("../models/QuizParticipant"); // Assuming a QuizParticipant model exists

// Get participants for a quiz
router.get("/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const participants = await QuizParticipant.find({ quiz: quizId });
    res.status(200).json(participants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch participants" });
  }
});

module.exports = router;
