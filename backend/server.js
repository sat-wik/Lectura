// Using ES Modules syntax
import express from 'express';
import multer from 'multer';
import cors from 'cors';

const app = express();
app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage: storage });

// Routes
app.post('/upload', upload.array('files'), (req, res) => {
    console.log('Files uploaded:', req.files);
    res.status(200).json({ message: 'Files uploaded successfully', files: req.files });
});

app.get('/', (req, res) => {
    res.send('Welcome to QuizCraft API!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
