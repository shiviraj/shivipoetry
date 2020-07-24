const { Post } = require('../models/post');
const { Category } = require('../models/category');
const { Tag } = require('../models/tag');
const { shuffle, updatePostCountAndGetToken } = require('./utils');
const LIMIT = 10;

const servePosts = async function (req, res) {
  const { pageNo = 1 } = req.body;
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', ['displayName', 'username'])
      .sort({ date: -1 })
      .skip(LIMIT * (pageNo - 1))
      .limit(LIMIT);
    res.send(posts);
  } catch (e) {
    res.status(500).send();
  }
};

const serveNoOfPages = async function (req, res) {
  try {
    const totalPosts = await Post.countDocuments({ status: 'published' });
    res.send({ pages: Math.ceil(totalPosts / LIMIT) });
  } catch (e) {
    res.status(500).send();
  }
};

const serveUrl = async function (req, res) {
  const [, , url] = req.path.split('/');
  try {
    const token = await updatePostCountAndGetToken(req, url, Post);
    const post = await Post.findOne({ url });
    await post
      .populate('author', ['displayName', 'username'])
      .populate('tags', ['name', 'url'])
      .populate('categories', ['name', 'url'])
      .execPopulate();
    if (!post) res.status(404).send();
    const randomPosts = await Post.find({
      status: 'published',
    }).populate('author', ['displayName', 'username']);
    post.relatedPosts = shuffle(randomPosts).slice(0, 4);
    res.cookie('postToken', `postToken ${token}`);
    res.render('post', post);
  } catch (e) {
    res.status(500).send();
  }
};

// const servePostContent = async function (req, res) {
//   const [, url] = req.body.postUrl.split('/');
//   try {
//     const token = await updatePostCountAndGetToken(req, url, Post);
//     const post = await Post.findOne({ url });
//     await post
//       .populate('author', ['displayName', 'username'])
//       .populate('tags', ['name', 'url'])
//       .populate('categories', ['name', 'url'])
//       .execPopulate();
//     if (!post) res.status(404).send();
//     res.cookie('postToken', `postToken ${token}`).send(post);
//   } catch (e) {
//     res.status(500).send();
//   }
// };

const serveCategories = async function (req, res) {
  try {
    const result = await Category.find();
    res.send(result);
  } catch {
    res.status(500).end();
  }
};

const serveTags = async function (req, res) {
  try {
    const result = await Tag.find();
    res.send(result);
  } catch {
    res.status(500).end();
  }
};

module.exports = {
  servePosts,
  serveNoOfPages,
  serveUrl,
  serveCategories,
  serveTags,
};
