const { Post } = require('../models/post');
const { serveTemplate, shuffle } = require('./utils');
const LIMIT = 10;

const servePosts = async function (req, res) {
  const { pageNo = 1 } = req.body;
  try {
    const posts = await Post.find()
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
    const posts = await Post.find();
    res.send({ pages: Math.ceil(posts.length / LIMIT) });
  } catch (e) {
    res.status(500).send();
  }
};

const serveUrl = function (req, res) {
  serveTemplate('post.html', res);
};

const servePostContent = async function (req, res) {
  const [, url] = req.body.postUrl.split('/');
  try {
    const post = await Post.findOne({ url });
    await post
      .populate('author', ['displayName', 'username'])
      .populate('preLink', ['title', 'url'])
      .populate('nextLink', ['title', 'url'])
      .populate('tags', ['name', 'url'])
      .populate('categories', ['name', 'url'])
      .execPopulate();
    if (!post) res.status(404).send();
    res.send(post);
  } catch (e) {
    res.status(500).send();
  }
};

const serveRelatedPosts = async function (req, res) {
  try {
    const posts = await Post.find().populate('author', [
      'displayName',
      'username',
    ]);
    const randomPosts = shuffle(posts).slice(0, 4);
    if (!randomPosts) res.status(404).send();
    res.send(randomPosts);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  servePosts,
  serveNoOfPages,
  serveUrl,
  servePostContent,
  serveRelatedPosts,
};
