import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Quizzes.css';

const Quizzes = () => {
  const location = useLocation();
  const quizQuestions = location.state?.quizQuestions || [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleAnswerChange = (e) => {
    setSelectedAnswer(e.target.value);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer('');
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, quizQuestions.length - 1));
  };

  if (quizQuestions.length === 0) {
    return <div>No quiz questions available</div>;
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h3>Question {currentQuestionIndex + 1} of {quizQuestions.length}</h3>
      <p>{currentQuestion.question}</p>
      <div className="answer-options">
        {currentQuestion.answer_choices.map((choice, index) => (
          <div key={index} className="answer-option">
            <label>
              <input
                type="radio"
                name="answer"
                value={choice}
                checked={selectedAnswer === choice}
                onChange={handleAnswerChange}
              />
              {choice}
            </label>
          </div>
        ))}
      </div>
      <div className="quiz-controls">
        <button onClick={handleNextQuestion} disabled={currentQuestionIndex >= quizQuestions.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Quizzes;
