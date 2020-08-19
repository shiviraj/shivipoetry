const moment = require('moment');
const { Comments } = require('./wrapper/comments');
const { Posts } = require('./wrapper/posts');
const { updatePostCountAndGetToken } = require('./utils');
const { sidebarContent } = require('./sidebarContent');

const servePosts = async function (req, res) {
  try {
    const page = req.params.page || 1;
    const pages = await Posts.getTotalPages();
    const posts = await Posts.getPosts(page);
    const sidebar = await sidebarContent();
    res.render('index', { posts, sidebar, moment, pages, page });
  } catch (e) {
    res.status(500).send();
  }
};

const servePost = async function (req, res) {
  try {
    const url = req.params.postUrl;
    const token = await updatePostCountAndGetToken(req, url);
    const post = await Posts.getPostByUrl(url);
    const relatedPosts = await Posts.getRandomPost();
    const sidebar = await sidebarContent();
    res.cookie('postToken', `postToken ${token}`);
    res.render('post', Object.assign(post, { relatedPosts, sidebar, moment }));
  } catch (e) {
    res.status(500).send();
  }
};

const addCommentAndServe = async function (req, res) {
  try {
    await Comments.add(req.body);
    res.send();
  } catch (e) {
    res.status(422).end();
  }
};

module.exports = { servePosts, servePost, addCommentAndServe };
