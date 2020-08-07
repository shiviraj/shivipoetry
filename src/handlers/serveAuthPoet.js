const moment = require('moment');
const { Category } = require('../models/category');
const { Comment } = require('../models/comment');
const { Tag } = require('../models/tag');
const { Post } = require('../models/post');

const getAllPosts = async (author) => {
  return await Post.find({ author })
    .populate('author', ['displayName', 'username'])
    .populate('tags', ['name', 'url'])
    .populate('categories', ['name', 'url'])
    .sort({ date: -1 });
};

const serveDashboard = async function (req, res) {
  const allPosts = await getAllPosts(req.author._id);
  res.render('poet/dashboard', Object.assign(req.author, { allPosts, moment }));
};

const serveEditor = async function (req, res) {
  const categories = await Category.find({});
  const tags = await Tag.find({});
  res.render('poet/addPost', Object.assign(req.author, { categories, tags }));
};

const serveEditorWithPost = async function (req, res) {
  const options = { url: req.params.url, author: req.author._id };
  const post = await Post.findOne(options);
  await post
    .populate('tags', ['name', 'url'])
    .populate('categories', ['name', 'url'])
    .execPopulate();
  const categories = await Category.find({});
  const tags = await Tag.find({});
  res.render(
    'poet/editor',
    Object.assign(req.author, { post, categories, tags })
  );
};

const getAllComments = async function (author) {
  const fields = ['_id', 'title', 'url'];
  const posts = await Post.find({ author: author._id }).select(fields);
  await Promise.all(
    posts.map(async (post) => {
      post.comments = await Comment.find({ post: post._id });
    })
  );
  return posts;
};

const serveComments = async (req, res) => {
  const posts = await getAllComments(req.author);
  res.render('poet/comment', Object.assign(req.author, { posts, moment }));
};

const deleteComment = async function (req, res) {
  await Comment.findByIdAndDelete(req.params.id);
  res.redirect('/poet/comment');
};

const updateComment = async function (req, res) {
  const { status, id } = req.params;
  await Comment.findByIdAndUpdate(id, { status });
  res.redirect('/poet/comment');
};

const serveURLAvailability = async function (req, res) {
  const result = await Post.findOne({ url: req.body.url });
  const isAvailable = !result || result.url == req.body.currentUrl;
  res.send({ isAvailable });
};

module.exports = {
  serveDashboard,
  serveEditor,
  serveEditorWithPost,
  serveComments,
  deleteComment,
  updateComment,
  serveURLAvailability,
};
