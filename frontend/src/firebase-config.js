import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDME_aCST44rOw5qMqatHKv7uPH_oCBl0E",
    authDomain: "quizforge-8da3a.firebaseapp.com",
    projectId: "quizforge-8da3a",
    storageBucket: "quizforge-8da3a.appspot.com",
    messagingSenderId: "469875352718",
    appId: "1:469875352718:web:ab3f122e653bb5059c15df",
    measurementId: "G-5NMW8XRCNS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Google Auth Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
