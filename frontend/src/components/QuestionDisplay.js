import React from 'react';
import { useLocation } from 'react-router-dom';

const QuestionDisplay = () => {
  const location = useLocation();
  const { text } = location.state || { text: '' };

  return (
    <div>
      <h1>Generated Questions</h1>
      <p>Questions generated from: {text}</p>
      {/* Render questions here */}
    </div>
  );
};

export default QuestionDisplay;
