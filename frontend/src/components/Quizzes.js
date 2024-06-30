import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Quizzes.css';

const Quizzes = () => {
  const location = useLocation();
  const quizQuestions = location.state?.quizQuestions || [];

  if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) {
    return <div>No quiz questions available.</div>;
  }

  return (
    <div className="quizzes-container">
      <h1>Generated Quiz</h1>
      {quizQuestions.map((question, index) => (
        <div key={index} className="quiz-question">
          <h3>{question.question}</h3>
          <ul>
            {question.answer_choices.map((choice, idx) => (
              <li key={idx}>
                <label>
                  <input type="radio" name={`question-${index}`} value={choice} />
                  {choice}
                </label>
              </li>
            ))}
          </ul>
          <div className="quiz-actions">
            <button className="submit-btn">Submit</button>
            <button className="next-btn">Next</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Quizzes;
