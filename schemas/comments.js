const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const commentsSchema = new mongoose.Schema({
  commentsId: {
    type: Number,
    unique: true,
  },
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
  createdAt: {
    type: String,
    require: true,
  },
});
commentsSchema.plugin(AutoIncrement, { inc_field: 'commentsId' });

module.exports = mongoose.model('Comments', commentsSchema);
