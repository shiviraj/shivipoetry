const moment = require('moment');
const { Category } = require('../models/category');
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
  res.render('poet/addPost', req.author);
};

const serveEditorWithPost = async function (req, res) {
  const post = await Post.findOne({ url: req.params.url });
  res.render('poet/editor', Object.assign(req.author, post));
};

const serveAllCategories = async function (req, res) {
  const categories = await Category.find();
  res.send(categories);
};

const serveAllTags = async function (req, res) {
  const tags = await Tag.find();
  res.send(tags);
};

const serveURLAvailability = async function (req, res) {
  const result = await Post.findOne({ url: req.body.url });
  const isAvailable = !result || result.url == req.body.currentUrl;
  res.send({ isAvailable });
};

const serveAllPosts = async function (req, res) {
  const result = await Post.find({ author: req.author['_id'] })
    .populate('author', ['displayName', 'username'])
    .populate('tags', ['name', 'url'])
    .populate('categories', ['name', 'url'])
    .sort({ date: -1 });
  res.send(result);
};

const servePost = async function (req, res) {
  const options = { url: req.body.url, author: req.author._id };
  const result = await Post.findOne(options);
  if (!result) return res.status(404).end();
  await result
    .populate('tags', ['name', 'url'])
    .populate('categories', ['name', 'url'])
    .execPopulate();
  res.send(result);
};

module.exports = {
  serveDashboard,
  serveEditor,
  serveEditorWithPost,
  serveAllCategories,
  serveAllTags,
  serveURLAvailability,
  serveAllPosts,
  servePost,
};
