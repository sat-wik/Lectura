import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Quizzes.css';

const Quizzes = () => {
  const location = useLocation();
  const quizQuestions = location.state?.quizQuestions || [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerChange = (e) => {
    setSelectedAnswer(e.target.value);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer('');
    setShowResult(false);
    setIsCorrect(false);
    setAnswerSubmitted(false);
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, quizQuestions.length - 1));
  };

  const handleSubmit = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isAnswerCorrect = selectedAnswer === currentQuestion.correct_answer;
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
    setAnswerSubmitted(true);
    if (isAnswerCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleFinishQuiz = () => {
    setQuizCompleted(true);
  };

  if (quizQuestions.length === 0) {
    return <div>No quiz questions available</div>;
  }

  if (quizCompleted) {
    return (
      <div className="quiz-container">
        <h3>Quiz Completed!</h3>
        <p>Your score is: {score} out of {quizQuestions.length}</p>
      </div>
    );
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
                disabled={answerSubmitted}
              />
              {choice}
            </label>
          </div>
        ))}
      </div>
      <div className="quiz-controls">
        <button onClick={handleSubmit} disabled={!selectedAnswer || showResult}>Submit</button>
        {showResult && (
          <>
            {currentQuestionIndex < quizQuestions.length - 1 ? (
              <button onClick={handleNextQuestion} disabled={!answerSubmitted || currentQuestionIndex >= quizQuestions.length - 1}>
                Next
              </button>
            ) : (
              <button onClick={handleFinishQuiz}>Finish Quiz</button>
            )}
          </>
        )}
      </div>
      {showResult && (
        <div className={`result ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? 'Correct!' : `Incorrect! The correct answer is ${currentQuestion.correct_answer}.`}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
