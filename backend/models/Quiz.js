const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  label: String,
  value: Number,
});

const optionSchema = new mongoose.Schema({
  text: String,
  image: String,
});

const questionSchema = new mongoose.Schema({
  questionText: String,
  questionImage: String,
  options: [optionSchema],
  correctOption: Number,
});

const quizSchema = new mongoose.Schema({
  quizImage: String,
  quizName: String,
  quizDescription: String,
  pricepool: Number,
  entranceFee: Number,
  timer: Number,
  rewards: [rewardSchema],
  questions: [questionSchema],
  creatorWalletID: {
    type: String,
    required: true,
  },
  participants: [
    {
      walletID: String,
      score: Number,
    },
  ],
});

module.exports = mongoose.model("Quiz", quizSchema);
