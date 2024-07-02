import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useLocation } from 'react-router-dom';
import { auth } from './firebase-config';
import FileUpload from './components/FileUpload';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Quizzes from './components/Quizzes';
import Quiz from './components/Quiz';
import './styles/App.css';

// Create a context for quiz state
export const QuizContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      if (user) {
        fetchQuizzes();
      }
    });
    return unsubscribe;
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://localhost:5000/quizzes');
      const data = await response.json();
      setQuizzes(data.quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  return (
    <QuizContext.Provider value={{ quizzes, setQuizzes, fetchQuizzes }}>
      <Router>
        <AppContent user={user} />
      </Router>
    </QuizContext.Provider>
  );
};

const AppContent = ({ user }) => {
  const location = useLocation();
  const showSidebar = user && !['/login', '/signup'].includes(location.pathname);

  return (
    <div className="app-container">
      {showSidebar && (
        <div className="sidebar">
          <div className="logo">
            <img src="https://github.com/sat-wik/QuizForce/blob/main/frontend/src/assets/QuizForce.png?raw=true" alt="QuizForce Logo" />
          </div>
          <ul>
            <li><Link to="/quizzes">Quizzes</Link></li>
            <li><Link to="/file-upload">File Upload</Link></li>
          </ul>
        </div>
      )}
      <div className="content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={user ? <Navigate to="/quizzes" /> : <Navigate to="/login" />} />
          <Route path="/quizzes" element={user ? <Quizzes /> : <Navigate to="/login" />} />
          <Route path="/quizzes/:id" element={user ? <Quiz /> : <Navigate to="/login" />} />
          <Route path="/file-upload" element={user ? <FileUpload /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
