import React, { useState, useEffect } from "react";

const Modal = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(600); // For testing, changed time to 10 seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // List of cloud image URLs
  const imageUrls = [
    "https://www.w3schools.com/images/w3schools_green.jpg",
    "https://www.w3schools.com/images/w3schools_green.jpg",
    "https://www.w3schools.com/images/w3schools_green.jpg",
  ];

  // Define quiz questions
  const quizQuestions = [
    {
      question: "What is the powerhouse of the cell?",
      options: [
        "Golgi apparatus",
        "Nucleus",
        "Mitochondria",
        "Endoplasmic reticulum",
      ],
      correctAnswer: "Mitochondria",
      image: imageUrls[0],
    },
    {
      question:
        "Which process allows plants to convert sunlight into chemical energy?",
      options: ["Respiration", "Photosynthesis", "Osmosis", "Diffusion"],
      correctAnswer: "Photosynthesis",
    },
    {
      question:
        "What is the primary function of red blood cells in the human body?",
      options: [
        "Fighting infections",
        "Transporting oxygen",
        "Producing antibodies",
        "Digesting food",
      ],
      correctAnswer: "Transporting oxygen",
      image: imageUrls[1],
    },
    {
      question:
        "Which of the following is NOT a function of the skeletal system?",
      options: [
        "Providing structural support",
        "Producing blood cells",
        "Facilitating movement",
        "Storing fat",
      ],
      correctAnswer: "Storing fat",
    },
    {
      question: "",
      options: ["Radius", "Femur", "Tibia", "Humerus"],
      correctAnswer: "Femur",
      image: imageUrls[2],
    },
    {
      question:
        "Which organ is responsible for filtering waste products from the blood?",
      options: ["Liver", "Kidney", "Pancreas", "Spleen"],
      correctAnswer: "Kidney",
    },
    {
      question:
        "What is the chemical responsible for carrying genetic information in living organisms?",
      options: ["RNA", "DNA", "Protein", "Carbohydrate"],
      correctAnswer: "DNA",
    },
    {
      question:
        "Which part of a plant is responsible for the process of transpiration?",
      options: ["Stomata", "Petals", "Roots", "Stem"],
      correctAnswer: "Stomata",
    },
    {
      question:
        "What is the unit of heredity that is passed from parents to offspring?",
      options: ["Allele", "Chromosome", "Gene", "Phenotype"],
      correctAnswer: "Gene",
    },
    {
      question:
        "What is the process by which cells replicate their DNA and divide into two identical daughter cells?",
      options: ["Mitosis", "Meiosis", "Fertilization", "Apoptosis"],
      correctAnswer: "Mitosis",
    },
  ];

  // Shuffle questions on component mount
  useEffect(() => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
          setShowMessage(true); // Show message when time elapses
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Clear the interval when component unmounts or time reaches 0
    return () => clearInterval(timer);
  }, []);

  // Handle next button click
  const handleNext = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    }
  };

  // Handle previous button click
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prevQuestion) => prevQuestion - 1);
    }
  };

  // Handle option selection
  const handleOptionSelect = (selectedOption) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion]: selectedOption,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Here you can send the answers to the database or perform any other action
    console.log("Answers:", answers);
    setShowMessage(true); // Show message when user submits
  };

  // Handle redirection to home page
  const handleRedirect = () => {
    // Perform redirection logic here
    window.location.href = "/quizInfo";
    console.log("Redirecting to home page...");
  };

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content" style={modalContentStyle}>
        {showMessage ? (
          <>
            <div className="maincard">
              <div
                style={{
                  background: "#213743",
                  border: "5px solid #b1bad3",
                }}
                className="card info-card revenue-card"
              >
                <div className="card-body">
                  <h6 style={{ color: "#d5dceb" }}>
                    Thanks for participating!
                  </h6>
                </div>
              </div>

              <div className="container">
                <div className="row">
                  <div className="col">
                    <div className="d-flex justify-content-between">
                      <div className="flex-fill mr-2">
                        <button
                          onClick={handleRedirect}
                          className="btn btn-primary btn-block"
                          id="optionbut"
                        >
                          See Results
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span style={{ color: "#b1bad3" }}>
                  Question: {currentQuestion + 1} / {shuffledQuestions.length}
                </span>
              </div>
              <div>
                <span style={{ color: "#b1bad3" }}>
                  {Math.floor(timeLeft / 60)}:
                  {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
                </span>
              </div>
            </div>
            {currentQuestion < shuffledQuestions.length && (
              <div className="maincard">
                <div
                  style={{
                    background: "#213743",
                    border: "5px solid #b1bad3",
                    borderStyle: "dashed",
                  }}
                  className="card info-card revenue-card"
                >
                  <div className="card-body">
                    {shuffledQuestions[currentQuestion].image && (
                      <img
                        src={shuffledQuestions[currentQuestion].image}
                        alt="Question"
                        style={{
                          display: "block",
                          width: "30rem",
                          maxWidth: "30rem",
                          minHeight: "10rem",
                          maxHeight: "10rem",
                          borderRadius: "10px",
                          margin: "0 auto",
                        }}
                      />
                    )}
                    <h6 style={{ color: "#d5dceb", marginTop: "10px" }}>
                      {shuffledQuestions[currentQuestion].question}
                    </h6>
                  </div>
                </div>

                <div className="container">
                  {shuffledQuestions[currentQuestion].options.map(
                    (option, index) =>
                      index % 2 === 0 && (
                        <div key={index} className="row mb-2">
                          <div className="col-md-6">
                            <button
                              onClick={() => handleOptionSelect(option)}
                              className={`btn btn-block ${
                                answers[currentQuestion] === option
                                  ? "btn-success"
                                  : "btn-secondary"
                              }`}
                            >
                              {option}
                            </button>
                          </div>
                          <div className="col-md-6">
                            <button
                              onClick={() =>
                                handleOptionSelect(
                                  shuffledQuestions[currentQuestion].options[
                                    index + 1
                                  ]
                                )
                              }
                              className={`btn btn-block ${
                                answers[currentQuestion] ===
                                shuffledQuestions[currentQuestion].options[
                                  index + 1
                                ]
                                  ? "btn-success"
                                  : "btn-secondary"
                              }`}
                            >
                              {
                                shuffledQuestions[currentQuestion].options[
                                  index + 1
                                ]
                              }
                            </button>
                          </div>
                        </div>
                      )
                  )}
                </div>

                <br />
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <button onClick={handlePrevious} id="followbtn">
                      Previous
                    </button>
                    <button onClick={handleNext} id="followbtn">
                      Next
                    </button>
                  </div>
                  <div>
                    <button onClick={handleSubmit} id="followbtn">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;

// Inline CSS styles for the modal
const modalStyle = {
  display: "block",
  position: "fixed",
  zIndex: "9999",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
};

const modalContentStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "80%",
  width: "auto",
  minWidth: "300px",
  background: "#1a2c38",
  border: "1px solid white",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};
