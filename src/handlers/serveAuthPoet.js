const moment = require('moment');
const { Comments } = require('./wrapper/comments');
const { Posts } = require('./wrapper/posts');
const { getTagsAndCategories } = require('./wrapper/tagsAndCategories');

const serveDashboard = async function (req, res) {
  const allPosts = await Posts.getPostsByAuthor(req.author._id);
  res.render('poet/dashboard', Object.assign(req.author, { allPosts, moment }));
};

const serveEditor = async function (req, res) {
  const tagsAndCategories = await getTagsAndCategories();
  res.render('poet/addPost', Object.assign(req.author, tagsAndCategories));
};

const serveEditorWithPost = async function (req, res) {
  const author = req.author;
  const post = await Posts.getPostByUrlAndAuthor(req.params.url, author._id);
  const tagsAndCategories = await getTagsAndCategories();
  res.render('poet/editor', Object.assign(author, { post }, tagsAndCategories));
};

const serveComments = async (req, res) => {
  const posts = await Comments.getAllWithPost(req.author._id);
  res.render('poet/comment', Object.assign(req.author, { posts, moment }));
};

const deleteComment = async function (req, res) {
  await Comments.delete(req.params.id);
  res.redirect('/poet/comment');
};

const updateComment = async function (req, res) {
  await Comments.update(req.params.id, req.params.status);
  res.redirect('/poet/comment');
};

const serveURLAvailability = async function (req, res) {
  const { url, currentUrl } = req.body;
  const isAvailable = await Posts.isUrlAvailable(url, currentUrl);
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
