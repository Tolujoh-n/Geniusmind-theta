import React, { useState } from "react";

const styles = {
  container: {
    color: "white",
    backgroundColor: "transparent",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  formContainer: {
    marginTop: "20px",
  },
  questContainer: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "20px",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
  },
  button: {
    padding: "10px",
    backgroundColor: "orange",
    color: "white",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    marginRight: "10px",
  },
  table: {
    width: "100%",
    marginBottom: "10px",
  },
  tableRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
};

const QuizForm = ({
  onSubmit,
  quizTitle,
  pricepool,
  entranceFee,
  timer,
  quizDescription,
  rewards,
  generateIncorrectOptions,
}) => {
  const [quiz, setQuiz] = useState([]);

  const handleAddQuiz = () => {
    setQuiz((prevQuiz) => [
      ...prevQuiz,
      {
        question: "",
        questionimg: "",
        options: Array(4).fill(""),
        correctOption: null,
        correctAnswer: "",
      },
    ]);
  };

  const handleQuestChange = (index, field, value) => {
    setQuiz((prevQuiz) =>
      prevQuiz.map((quest, i) =>
        i === index ? { ...quest, [field]: value } : quest
      )
    );
  };

  const handleOptionChange = (index, optionIndex, value) => {
    setQuiz((prevQuiz) =>
      prevQuiz.map((quest, i) =>
        i === index
          ? {
              ...quest,
              options: quest.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : quest
      )
    );
  };

  const handleCheckboxChange = (index, optionIndex) => {
    setQuiz((prevQuiz) =>
      prevQuiz.map((quest, i) =>
        i === index
          ? {
              ...quest,
              correctOption: optionIndex,
              correctAnswer: quest.options[optionIndex],
            }
          : quest
      )
    );
  };

  const handleGenerateAIWrongOptions = async (index) => {
    const { question, correctAnswer } = quiz[index];
    const incorrectOptions = await generateIncorrectOptions(
      question,
      correctAnswer
    );
    setQuiz((prevQuiz) =>
      prevQuiz.map((quest, i) =>
        i === index
          ? {
              ...quest,
              options: quest.options.map((opt, idx) =>
                idx !== quest.correctOption && incorrectOptions.length > 0
                  ? incorrectOptions.shift()
                  : opt
              ),
            }
          : quest
      )
    );
  };

  const handleSubmit = () => {
    console.log("Quiz Submitted:", {
      quizTitle,
      pricepool,
      entranceFee,
      timer,
      quiz,
    });
    console.log("Quiz Form Information Submitted:", {
      quizTitle,
      pricepool,
      quizDescription,
      entranceFee,
      timer,
      rewards,
    });
    onSubmit({ quizTitle, pricepool, entranceFee, timer, quiz });
  };

  return (
    <div style={styles.formContainer}>
      {quiz.map((quest, index) => (
        <div key={index} style={styles.questContainer}>
          <div
            style={{
              border: "1px solid gray",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <div className="row gy-4">
              <div className="col-md-12">
                <div className="form-group">
                  <label style={styles.label}>Question: {index + 1}</label>
                  <textarea
                    type="text"
                    className="form-control"
                    placeholder="Type your Questions"
                    value={quest.question}
                    onChange={(e) =>
                      handleQuestChange(index, "question", e.target.value)
                    }
                    style={styles.textarea}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={styles.label}>Question Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    value={quest.questionimg}
                    onChange={(e) =>
                      handleQuestChange(index, "questionimg", e.target.value)
                    }
                    style={styles.textarea}
                    required
                  />
                </div>
              </div>
              {quest.options.map((option, optionIndex) => (
                <div className="col-md-6" key={optionIndex}>
                  <div className="form-group">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          checked={quest.correctOption === optionIndex}
                          onChange={() =>
                            handleCheckboxChange(index, optionIndex)
                          }
                        />
                        <input
                          type="text"
                          className="form-control ml-2"
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              optionIndex,
                              e.target.value
                            )
                          }
                          style={styles.input}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleGenerateAIWrongOptions(index)}
              id="followbtn"
            >
              AI Wrong Options
            </button>
          </div>
        </div>
      ))}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <button onClick={handleAddQuiz} id="followbtn">
            Add Question
          </button>
        </div>
        <div>
          <button onClick={handleSubmit} id="followbtn">
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizForm;
