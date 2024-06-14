import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { TypingIndicator } from "@chatscope/chat-ui-kit-react";

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

interface QuizFormProps {
  onSubmit: (quizData: any) => void;
  quizTitle: string;
  pricepool: string;
  entranceFee: string;
  timer: string;
  quizDescription: string;
  rewards: string;
}

interface Quiz {
  question: string;
  questionimg: string;
  options: string[];
  correctOption: number | null;
  correctAnswer: string;
}

const QuizForm = ({
  onSubmit,
  quizTitle,
  pricepool,
  entranceFee,
  timer,
  quizDescription,
  rewards,
}: QuizFormProps) => {
  const [quiz, setQuiz] = useState<Quiz[]>([]);
  const [chatMessages, setChatMessages] = useState<
    { message: string; sender: string; direction: string; error: boolean }[]
  >([]);
  const [isChatbotTyping, setIsChatbotTyping] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleQuestChange = (index: number, field: string, value: string) => {
    setQuiz((prevQuiz) =>
      prevQuiz.map((quest, i) =>
        i === index ? { ...quest, [field]: value } : quest
      )
    );
  };

  const handleOptionChange = (
    index: number,
    optionIndex: number,
    value: string
  ) => {
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

  const handleCheckboxChange = (index: number, optionIndex: number) => {
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

  const fetchAIWrongOptions = async (
    question: string,
    correctAnswer: string,
    index: number
  ) => {
    const prompt = `I'm a quiz organizer and I want you to help me generate 3 incorrect options to this question "${question}". My answer is "${correctAnswer}". Type out only the 3 incorrect options. Please don't type any paragraph before your option list. Just give me only the 3 incorrect options.`;

    try {
      const response = await handleUserMessage(prompt);
      console.log("AI Response:", response); // Debug log
      const aiOptions = response
        .trim()
        .split("\n")
        .filter((option: string) => option);

      setQuiz((prevQuiz) =>
        prevQuiz.map((quest, i) =>
          i === index
            ? {
                ...quest,
                options: quest.options.map((opt, idx) =>
                  idx === quest.correctOption ? opt : aiOptions.pop() || opt
                ),
              }
            : quest
        )
      );
    } catch (error) {
      console.error("Error fetching AI wrong options:", error);
    }
  };

  const handleAIWrongOptions = (index: number) => {
    const { question, correctAnswer } = quiz[index];
    if (question && correctAnswer) {
      fetchAIWrongOptions(question, correctAnswer, index);
    } else {
      alert("Please fill in the question and select the correct answer first.");
    }
  };

  const handleUserMessage = async (userMessage: string) => {
    const newUserMessage = {
      message: userMessage,
      sender: "user",
      direction: "outgoing",
      error: false,
    };

    const updatedChatMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedChatMessages);
    setIsChatbotTyping(true);

    const response = await processUserMessageForGoogle(updatedChatMessages);
    setIsChatbotTyping(false);
    return response;
  };

  const processUserMessageForGoogle = async (messages: any[]) => {
    const contents = messages.map((messageObject) => {
      const role = messageObject.sender === "user" ? "user" : "model";
      return { role, parts: [{ text: messageObject.message }] };
    });

    const apiRequestBody = { contents };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta2/models/gemini-pro:streamGenerateContent?alt=sse&key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error(response.statusText);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let resultText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const decodedChunk = decoder.decode(value, { stream: true });
        const cleanedDecodedChunk = decodedChunk.replace(/^data:\s*/, "");

        try {
          const parsedChunk = JSON.parse(cleanedDecodedChunk);
          if (
            parsedChunk.candidates &&
            parsedChunk.candidates[0].content.parts[0].text
          ) {
            resultText += parsedChunk.candidates[0].content.parts[0].text;
          }
        } catch (error) {
          console.error("Error parsing chunk:", error); // Debug log
        }
      }

      console.log("Generated Text:", resultText); // Debug log
      setChatMessages([
        ...messages,
        {
          message: resultText,
          sender: "model",
          direction: "incoming",
          error: false,
        },
      ]);
      return resultText;
    } catch (error) {
      console.error("Error processing user message:", error);
      setChatMessages([
        ...messages,
        {
          message: "Error retrieving message",
          sender: "model",
          direction: "incoming",
          error: true,
        },
      ]);
      setIsChatbotTyping(false);
      throw error;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUserMessage(input);
      setInput("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSubmit = async () => {
    try {
      await axios.post("YOUR_BACKEND_ENDPOINT", {
        quizTitle,
        pricepool,
        entranceFee,
        timer,
        quizDescription,
        rewards,
        quiz,
      });
      alert("Quiz submitted successfully!");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Error submitting quiz.");
    }
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
              onClick={() => handleAIWrongOptions(index)}
              style={styles.button}
            >
              AI Wrong Options
            </button>
          </div>
        </div>
      ))}
      <div className="d-flex justify-content-between align-items-center">
        <button onClick={handleAddQuiz} style={styles.button}>
          Add Question
        </button>
        <button onClick={handleSubmit} style={styles.button}>
          Submit Quiz
        </button>
      </div>
      <div className="chat-messages">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.sender === "user" ? "user-message" : "ai-message"
            }`}
          >
            <div style={{ display: "flex" }}>
              {message.sender === "model" && (
                <img
                  style={{
                    height: "30px",
                    width: "30px",
                    borderRadius: "50%",
                    marginRight: "10px",
                    alignSelf: "flex-start",
                  }}
                  src="/path/to/logo.png" // replace with your logo path
                  alt="Logo"
                />
              )}
              <div>
                {message.error ? (
                  <>
                    <span>Error: {message.message}</span>
                  </>
                ) : (
                  message.message
                )}
              </div>
            </div>
          </div>
        ))}
        {isChatbotTyping && (
          <div className="chat-message ai-message">
            <TypingIndicator content="Chatbot is typing..." />
          </div>
        )}
        <div style={{ color: "red" }}>
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={() => handleUserMessage(input)}>Send</button>
      </div>
    </div>
  );
};

export default QuizForm;
