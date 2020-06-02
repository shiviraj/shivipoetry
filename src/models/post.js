const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author',
  },
  date: { type: Number },
  content: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  status: { type: String, required: true },
  url: { type: String, required: true, trim: true, unique: true },
  modified: { type: Number },
  type: { type: String, trim: true, default: 'post' },
  commentStatus: { type: String, default: 'open' },
  commentCount: { type: Number, default: 0 },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  views: { type: Number, default: 0 },
  tokens: [{ token: { type: String } }],
});

const Post = mongoose.model('Post', PostSchema);
module.exports = { Post };
