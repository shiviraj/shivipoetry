const mongodb = require('mongodb');
const { Category } = require('../models/category');
const { Tag } = require('../models/tag');
const { Post } = require('../models/post');

const serveAllCategories = async function (req, res) {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch {
    res.send(500);
  }
};

const serveAllTags = async function (req, res) {
  try {
    const tags = await Tag.find();
    res.send(tags);
  } catch {
    res.send(500);
  }
};

const serveURLAvailability = async function (req, res) {
  try {
    const result = await Post.findOne({ url: req.body.url });
    const isAvailable = !result || result.url == req.body.currentUrl;
    res.send({ isAvailable });
  } catch {
    res.status(500).send();
  }
};

const serveAllPosts = async function (req, res) {
  try {
    const result = await Post.find({ author: req.author['_id'] })
      .populate('author', ['displayName', 'username'])
      .populate('tags', ['name', 'url'])
      .populate('categories', ['name', 'url'])
      .sort({ date: -1 });
    res.send(result);
  } catch {
    res.status(500).send();
  }
};

const servePost = async function (req, res) {
  try {
    const options = { url: req.body.url, author: req.author._id };
    const result = await Post.findOne(options);
    await result
      .populate('tags', ['name', 'url'])
      .populate('categories', ['name', 'url'])
      .execPopulate();
    if (!result) return res.status(404).end();
    res.send(result);
  } catch {
    res.status(500).end();
  }
};

module.exports = {
  serveAllCategories,
  serveAllTags,
  serveURLAvailability,
  serveAllPosts,
  servePost,
};
