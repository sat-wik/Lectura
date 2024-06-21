import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase-config';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import '../styles/Login.css';  // Ensure this CSS file is linked

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (event) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Login successful:', userCredential.user);
                setError('');
            })
            .catch((error) => {
                console.error('Login failed:', error.message);
                setError(error.message);
            });
    };

    const signInWithGoogle = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                console.log('Google sign in successful:', result.user);
                setError('');
            })
            .catch((error) => {
                console.error('Google sign in failed:', error.message);
                setError(error.message);
            });
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1>Welcome to QuizForge</h1>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="submit" className="login-btn">Login</button>
                </form>
                <button className="google-btn" onClick={signInWithGoogle}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png?20230822192911" alt="Google" className="google-icon"/>
                    Sign in with Google
                </button>
                {error && <p className="error-message">{error}</p>}
                <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            <div className="visual-container">
                <img src="https://github.com/sat-wik/QuizForge/blob/main/frontend/src/assets/Online%20learning-amico.png?raw=true" alt="Educational Image" />
            </div>
        </div>
    );
};

export default Login;
