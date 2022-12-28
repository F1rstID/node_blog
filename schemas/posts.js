const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const postsSchema = new mongoose.Schema({
  _id: {
    type: Number,
    unique: true,
  },
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

postsSchema.plugin(AutoIncrement, { inc_field: '_id' });

module.exports = mongoose.model('Posts', postsSchema);
