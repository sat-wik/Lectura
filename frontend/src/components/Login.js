import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase-config';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import '../styles/Login.css';  // Ensure you have this CSS file for styling

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Login successful:', userCredential.user);
            })
            .catch((error) => {
                console.error('Login failed:', error.message);
            });
    };

    const signInWithGoogle = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                console.log('Google sign in successful:', result.user);
            })
            .catch((error) => {
                console.error('Google sign in failed:', error.message);
            });
    };

    return (
        <div className="login-container">
            <div className="form-container">
                <h1>GRADUATE SERVICE</h1>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
                    <input type="text" placeholder="Verification code" required />
                    <button type="submit">Login</button>
                </form>
                <button onClick={signInWithGoogle}>Sign in with Google</button>
                <a href="#">Forgot Password?</a>
            </div>
            <div className="visual-container">
                {/* SVG or Background Image */}
            </div>
        </div>
    );
};

export default Login;
