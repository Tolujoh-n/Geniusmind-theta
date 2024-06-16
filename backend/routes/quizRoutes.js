const express = require('express');
const { createQuiz, getQuiz, getAllQuizzes, participateInQuiz } = require('../controllers/quizController');
const router = express.Router();

router.post('/', createQuiz);
router.get('/:id', getQuiz);
router.get('/', getAllQuizzes);
router.post('/:id/participate', participateInQuiz);

module.exports = router;
