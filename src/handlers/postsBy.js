const moment = require('moment');
const { Author } = require('../models/author');
const { Tag } = require('../models/tag');
const { Category } = require('../models/category');
const { sidebarContent } = require('./sidebarContent');
const LIMIT = 10;

const getAuthorPosts = async (username, pageNo = 1) => {
  const author = await Author.findOne({ username });
  if (!author) {
    throw new Error({ error: 'author not exists' });
  }
  await author
    .populate({
      path: 'posts',
      match: { status: 'published' },
      options: { limit: LIMIT, skip: LIMIT * (pageNo - 1), sort: { date: -1 } },
      populate: { path: 'author' },
    })
    .execPopulate();
  return author.posts;
};

const getTagsPosts = async (url, pageNo = 1) => {
  const tag = await Tag.findOne({ url });
  if (!tag) {
    throw new Error({ error: 'tag not exists' });
  }
  await tag
    .populate({
      path: 'posts',
      match: { status: 'published' },
      options: { limit: LIMIT, skip: LIMIT * (pageNo - 1), sort: { date: -1 } },
      populate: { path: 'author' },
    })
    .execPopulate();
  return tag.posts;
};

const getCategoriesPosts = async (url, pageNo = 1) => {
  const category = await Category.findOne({ url });
  if (!category) {
    throw new Error({ error: 'category not exists' });
  }
  await category
    .populate({
      path: 'posts',
      match: { status: 'published' },
      options: { limit: LIMIT, skip: LIMIT * (pageNo - 1), sort: { date: -1 } },
      populate: { path: 'author' },
    })
    .execPopulate();
  return category.posts;
};

const getPages = async (key, value) => {
  const models = {
    category: { model: Category, findBy: 'url' },
    tag: { model: Tag, findBy: 'url' },
    author: { model: Author, findBy: 'username' },
  };
  const Model = models[key].model;
  const findBy = {};
  findBy[models[key].findBy] = value;
  const result = await Model.findOne(findBy);
  await result
    .populate({ path: 'posts', match: { status: 'published' } })
    .execPopulate();
  return Math.ceil(result.posts.length / LIMIT);
};

const servePosts = async (req, res) => {
  try {
    const [, key, value, page = 1] = req.path.split('/');
    const pages = await getPages(key, value);
    if (page < 1 || page > pages) {
      throw new Error('post not found');
    }
    const postsBy = {
      author: getAuthorPosts,
      tag: getTagsPosts,
      category: getCategoriesPosts,
    };
    const posts = await postsBy[key](value, page);
    const sidebar = await sidebarContent();
    res.render('postBy', { posts, sidebar, key, value, moment, page, pages });
  } catch (error) {
    res.status(500).end();
  }
};

module.exports = { servePosts };
