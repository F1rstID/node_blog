const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  user: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  createdAt: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('Posts', postsSchema);
