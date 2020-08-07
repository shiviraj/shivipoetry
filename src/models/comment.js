const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Post' },
  time: { type: Number, required: true, default: new Date() },
  name: { type: String, required: true, trim: true },
  msg: { type: String, required: true, trim: true },
  status: { type: String, required: true, default: 'unapproved' },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };
