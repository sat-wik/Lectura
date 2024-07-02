import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getVertexAI, getGenerativeModel } from 'firebase/vertexai-preview';
import multer from 'multer';
import bodyParser from 'body-parser';

// Load environment variables from .env file
dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase and Firestore
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Initialize the Vertex AI service
const vertexAI = getVertexAI(firebaseApp);

// Initialize the generative model with a model that supports your use case
const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Converts a Buffer to a Part object for the API
const bufferToGenerativePart = async (buffer, mimeType) => ({
  inlineData: { data: buffer.toString('base64'), mimeType }
});

// Endpoint to add a quiz
app.post('/upload', upload.array('files'), async (req, res) => {
  try {
    const files = req.files;
    const parts = await Promise.all(
      files.map(file => bufferToGenerativePart(file.buffer, file.mimetype))
    );

    const prompt = "Generate only multiple choice quiz questions from the provided content in JSON format with fields for question, answer choices, and correct answer. Ensure that the questions are different from the provided material and that every question has either a true/false answer or a multiple choice answer.";
    const inputParts = [prompt, ...parts];

    const response = await model.generateContentStream(inputParts);

    let result = '';
    for await (const chunk of response.stream) {
      result += chunk.text();
    }

    const quizData = {
      questions: JSON.parse(result.replace(/```json|```/g, '').trim()),
      createdAt: new Date().toISOString(),
      score: null
    };

    const docRef = await addDoc(collection(db, 'quizzes'), quizData);

    res.status(200).json({ message: 'Quiz added successfully', id: docRef.id });
  } catch (error) {
    console.error('Error adding quiz:', error);
    res.status(500).json({ message: 'Error adding quiz', error: error.message });
  }
});

// Endpoint to fetch all quizzes
app.get('/quizzes', async (req, res) => {
  try {
    const quizzesCol = collection(db, 'quizzes');
    const quizzesSnapshot = await getDocs(quizzesCol);
    const quizzesList = quizzesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (quizzesList.length === 0) {
      res.status(404).json({ message: 'No quizzes found' });
      return;
    }

    res.status(200).json({ quizzes: quizzesList });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
  }
});

// Endpoint to update a quiz score
app.put('/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    const quizDoc = doc(db, 'quizzes', id);
    await updateDoc(quizDoc, { score });
    res.status(200).json({ message: 'Quiz score updated successfully' });
  } catch (error) {
    console.error('Error updating quiz score:', error);
    res.status(500).json({ message: 'Error updating quiz score', error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to QuizForge API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
