// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuizPlatform {

    struct Question {
        string questionText;
        string questionImg;
        string[] options;
        uint correctOption;
    }

    struct Reward {
        string label;
        uint value;
    }

    struct Quiz {
        string title;
        string description;
        string imageUrl; 
        uint entranceFee;
        uint pricePool;
        uint timer;
        Question[] questions;
        Reward[] rewards;
        address organizer;
        bool isActive;
    }

    Quiz[] public quizzes;
    mapping(uint => mapping(address => bool)) public quizParticipants;

    event QuizCreated(uint indexed quizId, address indexed organizer, string title, string description, uint entranceFee, uint pricePool, uint timer);
    event ParticipantAdded(uint indexed quizId, address indexed participant);
    event QuizClosed(uint indexed quizId);

    function createQuiz(
    string memory title,
    string memory description,
    string memory imageUrl, // Added image URL parameter
    uint entranceFee,
    uint pricePool,
    uint timer,
    Question[] memory questions,
    Reward[] memory rewards
) public payable {
    require(msg.value == pricePool, "Price pool must be paid in THETA");

    Quiz storage newQuiz = quizzes.push();
    newQuiz.title = title;
    newQuiz.description = description;
    newQuiz.imageUrl = imageUrl; // Set image URL
    newQuiz.entranceFee = entranceFee;
    newQuiz.pricePool = pricePool;
    newQuiz.timer = timer;
    newQuiz.organizer = msg.sender;
    newQuiz.isActive = true;

    for (uint i = 0; i < questions.length; i++) {
        newQuiz.questions.push(Question({
            questionText: questions[i].questionText,
            questionImg: questions[i].questionImg,
            options: questions[i].options,
            correctOption: questions[i].correctOption
        }));
    }

    for (uint j = 0; j < rewards.length; j++) {
        newQuiz.rewards.push(Reward({
            label: rewards[j].label,
            value: rewards[j].value
        }));
    }

    emit QuizCreated(quizzes.length - 1, msg.sender, title, description, entranceFee, pricePool, timer);
}

    function participateInQuiz(uint quizId) public payable {
        Quiz storage quiz = quizzes[quizId];
        require(msg.value == quiz.entranceFee, "Incorrect entrance fee in TFUEL");
        require(quiz.isActive, "Quiz is not active");
        require(!quizParticipants[quizId][msg.sender], "Already participating");

        quizParticipants[quizId][msg.sender] = true;
        emit ParticipantAdded(quizId, msg.sender);
    }

    function submitAnswers(uint quizId, uint[] memory answers) public {
        Quiz storage quiz = quizzes[quizId];
        require(quizParticipants[quizId][msg.sender], "Not a participant");
        require(quiz.isActive, "Quiz is not active");

        uint correctAnswers = 0;
        for (uint i = 0; i < answers.length; i++) {
            if (answers[i] == quiz.questions[i].correctOption) {
                correctAnswers++;
            }
        }

        uint percentage = (correctAnswers * 100) / quiz.questions.length;
        uint reward = calculateReward(percentage, quiz.rewards);

        if (reward > 0 && quiz.pricePool >= reward) {
            quiz.pricePool -= reward;
            payable(msg.sender).transfer(reward);
        }

        if (quiz.pricePool < quiz.rewards[2].value) {
            quiz.isActive = false;
            emit QuizClosed(quizId);
        }
    }

    function calculateReward(uint percentage, Reward[] memory rewards) internal pure returns (uint) {
        if (percentage >= 80 && percentage <= 100) {
            return rewards[2].value;
        } else if (percentage >= 70 && percentage <= 79) {
            return rewards[1].value;
        } else if (percentage >= 60 && percentage <= 69) {
            return rewards[0].value;
        } else {
            return 0;
        }
    }

    function getQuiz(uint quizId) public view returns (
        string memory title,
        string memory description,
        string memory imageUrl,
        uint entranceFee,
        uint pricePool,
        uint timer,
        bool isActive
    ) {
        Quiz storage quiz = quizzes[quizId];
        return (
            quiz.title,
            quiz.description,
            quiz.imageUrl, 
            quiz.entranceFee,
            quiz.pricePool,
            quiz.timer,
            quiz.isActive
        );
    }

    function getQuizzesCount() public view returns (uint) {
        return quizzes.length;
    }

    function isParticipant(uint quizId, address participant) public view returns (bool) {
        return quizParticipants[quizId][participant];
    }
}
