// models/QuizParticipant.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuizParticipantSchema = new Schema({
  quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  name: { type: String, required: true },
  passed: { type: Number, required: true },
  failed: { type: Number, required: true },
  points: { type: Number, required: true },
  grade: { type: String, required: true },
});

module.exports = mongoose.model("QuizParticipant", QuizParticipantSchema);
