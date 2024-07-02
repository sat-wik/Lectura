import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../App';
import '../styles/Quizzes.css';

const Quizzes = () => {
  const { quizzes } = useContext(QuizContext);
  const navigate = useNavigate();

  if (!quizzes.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quizzes-container">
      <h3>Available Quizzes</h3>
      <ul className="quiz-list">
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="quiz-item" onClick={() => navigate(`/quizzes/${quiz.id}`)}>
            <div className="quiz-details">
              <div className="quiz-title">Quiz {quiz.id}</div>
              {quiz.score !== null && <div className="quiz-score">Score: {quiz.score}/{quiz.questions.length}</div>}
            </div>
            <button className="start-quiz-btn">Start Quiz</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quizzes;
