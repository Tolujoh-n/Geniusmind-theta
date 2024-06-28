import React, { useRef } from "react";
import QuizForm from "./QuizForm";
import Airesponse from "./Airesponse";
import Chatbot from "./Chatbot";

const AIquiz = ({
  pricepool,
  entranceFee,
  timer,
  quizTitle,
  quizDescription,
  rewards,
  onSubmit,
}) => {
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
        onSubmit={onSubmit}
        generateIncorrectOptions={handleGenerateIncorrectOptions}
        quizTitle={quizTitle}
        pricepool={pricepool}
        entranceFee={entranceFee}
        timer={timer}
        quizDescription={quizDescription}
        rewards={rewards}
      />
      <div style={{ display: "none" }} className="aistuff">
        <Airesponse ref={aiResponseRef} />
      </div>
    </div>
  );
};

export default AIquiz;
