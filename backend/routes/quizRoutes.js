const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

router.post("/", quizController.createQuiz);
router.get("/:id", quizController.getQuiz);
router.get("/", quizController.getAllQuizzes);
router.get("/user/:walletID", quizController.getUserQuizzes);
router.post("/:id/participate", quizController.participateInQuiz);

module.exports = router;
