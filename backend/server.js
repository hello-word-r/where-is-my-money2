const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Logger middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Ensure uploads directory exists (Using /tmp for Vercel Serverless environment)
const uploadDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir) && !process.env.VERCEL) {
    fs.mkdirSync(uploadDir);
}

// Multer storage (Use memoryStorage for Vercel Serverless to avoid FS issues)
const storage = process.env.VERCEL ? multer.memoryStorage() : multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes
app.post('/api/upload', (req, res, next) => {
    upload.single('bill')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err);
            return res.status(400).json({ error: err.message });
        } else if (err) {
            console.error('Upload Error:', err);
            return res.status(500).json({ error: 'Internal Server Error during upload' });
        }
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        console.log('File uploaded:', req.file.filename);
        res.json({ 
            message: 'File uploaded successfully', 
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}` 
        });
    });
});

app.post('/api/analyze', async (req, res) => {
    try {
        const { filename } = req.body;
        console.log('Analyzing file:', filename);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Mock analysis result
        const mockResult = {
            ranking: '恩格尔守门员',
            tags: ['#奶茶股东', '#深夜剁手', '#恩格尔系数爆表'],
            roast: '照你这个花法，建议你把“退休”两个字从字典里删掉。你的钱包比你的良心还空。',
            countdown: '2190年',
            tomorrowBudget: '20.5',
        };

        res.json(mockResult);
    } catch (error) {
        console.error('Analyze Error:', error);
        res.status(500).json({ error: 'Internal Server Error during analysis' });
    }
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
