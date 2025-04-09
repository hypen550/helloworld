require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Article = require('./models/Article');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('public/uploads'));
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI);

// Multer config
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes
app.get('/', async (req, res) => {
  const articles = await Article.find();
  res.render('index', { articles });
});

app.get('/admin', (req, res) => {
  res.render('admin');
});

app.post('/admin', upload.single('image'), async (req, res) => {
  const { title, description, content } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  await Article.create({ title, description, content, image });
  res.redirect('/');
});

// ✅ Only ONE app.listen here:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
