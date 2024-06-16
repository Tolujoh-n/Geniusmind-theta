const Quiz = require("../models/Quiz");

exports.createQuiz = async (req, res) => {
  const {
    quizImage,
    quizName,
    quizDescription,
    pricepool,
    entranceFee,
    timer,
    rewards,
    questions,
    creatorWalletID,
  } = req.body;

  try {
    const quiz = new Quiz({
      quizImage,
      quizName,
      quizDescription,
      pricepool,
      entranceFee,
      timer,
      rewards,
      questions,
      creatorWalletID,
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz", error });
  }
};

exports.getQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes", error });
  }
};

exports.participateInQuiz = async (req, res) => {
  const { id } = req.params;
  const { walletID, score } = req.body;

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const participantIndex = quiz.participants.findIndex(
      (p) => p.walletID === walletID
    );
    if (participantIndex !== -1) {
      quiz.participants[participantIndex].score = score;
    } else {
      quiz.participants.push({ walletID, score });
    }

    await quiz.save();
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error participating in quiz", error });
  }
};
