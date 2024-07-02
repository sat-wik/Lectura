import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizContext } from '../App';
import '../styles/Quiz.css';

const Quiz = () => {
  const { id } = useParams();
  const { quizzes, setQuizzes } = useContext(QuizContext);
  const navigate = useNavigate();
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const quiz = quizzes.find(q => q.id === id);
    if (quiz) {
      setCurrentQuiz(quiz);
    }
  }, [id, quizzes]);

  const handleAnswerChange = (e) => {
    setSelectedAnswer(e.target.value);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer('');
    setShowResult(false);
    setIsCorrect(false);
    setAnswerSubmitted(false);
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, currentQuiz.questions.length - 1));
  };

  const handleSubmit = () => {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const isAnswerCorrect = selectedAnswer === currentQuestion.correct_answer;
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
    setAnswerSubmitted(true);
    if (isAnswerCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleFinishQuiz = async () => {
    const updatedQuiz = { ...currentQuiz, score };
    await fetch(`http://localhost:5000/quizzes/${currentQuiz.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedQuiz),
    });
    const updatedQuizzes = quizzes.map(quiz => quiz.id === currentQuiz.id ? updatedQuiz : quiz);
    setQuizzes(updatedQuizzes);
    navigate('/quizzes');
  };

  if (!currentQuiz) {
    return <div>Loading...</div>;
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  return (
    <div className="quiz-container">
      <h3>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</h3>
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
            {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
              <button onClick={handleNextQuestion} disabled={!answerSubmitted}>Next</button>
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

export default Quiz;
