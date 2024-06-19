import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <div className="sidebar">
          <div className="logo">
            <img src="https://github.com/sat-wik/QuizForge/blob/main/frontend/src/assets/Screenshot%202024-06-19%20at%202.08.51%E2%80%AFPM.png?raw=true" alt="QuizForge Logo" />
          </div>
          <ul>
            <li><Link to="/quizzes">Quizzes</Link></li>
            <li><Link to="/lectures">Lectures</Link></li>
            <li><Link to="/tests">Tests</Link></li>
            <li><Link to="/file-upload">File Upload</Link></li>
            <li><Link to="/coding">Coding</Link></li>
          </ul>
        </div>
        <div className="content">
          <Routes>
            <Route path="/quizzes" element={<div>Quizzes Content</div>} />
            <Route path="/lectures" element={<div>Lectures Content</div>} />
            <Route path="/tests" element={<div>Tests Content</div>} />
            <Route path="/file-upload" element={<FileUpload />} />
            <Route path="/coding" element={<div>Coding Content</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
