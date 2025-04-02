const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  image: String
});

module.exports = mongoose.model('Article', articleSchema);