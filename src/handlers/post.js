const moment = require('moment');
const { Post } = require('../models/post');
const { Comment } = require('../models/comment');
const { shuffle, updatePostCountAndGetToken } = require('./utils');
const { sidebarContent } = require('./sidebarContent');
const LIMIT = 10;

const servePosts = async function (req, res) {
  try {
    const page = req.params.page || 1;
    const totalPosts = await Post.countDocuments({ status: 'published' });
    const pages = Math.ceil(totalPosts / LIMIT);
    if (page < 1 || page > pages) {
      throw new Error('post not found');
    }
    const posts = await Post.find({ status: 'published' })
      .populate('author', ['displayName', 'username'])
      .sort({ date: -1 })
      .skip((page - 1) * LIMIT)
      .limit(LIMIT);
    const sidebar = await sidebarContent();
    res.render('index', { posts, sidebar, moment, pages, page });
  } catch (e) {
    res.status(500).send();
  }
};

const getPost = async function (url) {
  const post = await Post.findOne({ url });
  await post
    .populate('author', ['displayName', 'username'])
    .populate('tags', ['name', 'url'])
    .populate('categories', ['name', 'url'])
    .execPopulate();
  const comments = await Comment.find({ post: post._id, status: 'approved' });
  return Object.assign(post, { comments });
};

const getRandomPost = async function (post) {
  const randomPosts = await Post.find({
    status: 'published',
  }).populate('author', ['displayName', 'username']);
  return shuffle(randomPosts).slice(0, 4);
};

const servePost = async function (req, res) {
  const [, , url] = req.path.split('/');
  try {
    const token = await updatePostCountAndGetToken(req, url, Post);
    const post = await getPost(url);
    const relatedPosts = await getRandomPost();
    const sidebar = await sidebarContent();
    res.cookie('postToken', `postToken ${token}`);
    res.render('post', Object.assign(post, { relatedPosts, sidebar, moment }));
  } catch (e) {
    res.status(500).send();
  }
};

const addCommentAndServe = async function (req, res) {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.send();
  } catch (e) {
    res.status(422).end();
  }
};

module.exports = { servePosts, servePost, addCommentAndServe };
