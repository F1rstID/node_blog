const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
  postId: {
    type: String,
    require: true,
  },
  user: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
}, { timestamps: true, updateAt: true });

module.exports = mongoose.model('Comments', commentsSchema);
