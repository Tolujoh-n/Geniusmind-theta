import React, { useRef } from "react";
import QuizForm from "./QuizForm";
import Airesponse from "./Airesponse";
import Chatbot from "./Chatbot";

const AIquiz = () => {
  const aiResponseRef = useRef();

  const handleGenerateIncorrectOptions = async (question, correctAnswer) => {
    return new Promise((resolve) => {
      aiResponseRef.current
        .handleGenerateIncorrectOptions(question, correctAnswer)
        .then(resolve);
    });
  };

  return (
    <div>
      <QuizForm
        onSubmit={(data) => console.log("Submitted Data:", data)}
        generateIncorrectOptions={handleGenerateIncorrectOptions}
      />
      <div style={{ display: "none" }} className="aistuff">
        <Airesponse ref={aiResponseRef} />
      </div>
    </div>
  );
};

export default AIquiz;
