import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import '../styles/SignUp.css';  // Ensure this CSS file is linked

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Sign up successful:', userCredential.user);
                setError('');
                navigate('/quizzes');
            })
            .catch((error) => {
                console.error('Sign up failed:', error.message);
                setError(error.message);
            });
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h1>Sign Up</h1>
                <form onSubmit={handleSignUp}>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        required 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        required 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Confirm Password" 
                        required 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                    />
                    <button type="submit" className="signup-btn">Sign Up</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <div className="login-link">
                    Already have an account? <a href="#" onClick={() => navigate('/login')}>Sign in instead</a>
                </div>
            </div>
            <div className="visual-container">
                <img src="https://github.com/sat-wik/QuizForge/blob/main/frontend/src/assets/Online%20learning-amico.png?raw=true" alt="Educational Image" />
            </div>
        </div>
    );
};

export default SignUp;
