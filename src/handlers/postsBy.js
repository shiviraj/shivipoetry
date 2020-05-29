const { Author } = require('../models/author');
const { Tag } = require('../models/tag');
const { Category } = require('../models/category');
const { serveTemplate } = require('./utils');
const LIMIT = 10;

const serveByUrl = function (req, res) {
  serveTemplate('postsBy.html', res);
};

const serveAuthorsPosts = async function (res, username, pageNo) {
  try {
    const result = await Author.findOne({ username });
    await result
      .populate({
        path: 'posts',
        match: { status: 'published' },
        options: {
          limit: LIMIT,
          skip: LIMIT * (pageNo - 1),
          sort: { date: 1 },
        },
      })
      .execPopulate();
    if (!result.posts) return res.status(404).send();
    res.send({ posts: result.posts, author: result });
  } catch (e) {
    res.status(500).send();
  }
};

const serveTagsOrCategoriesPosts = async function (res, Model, url, pageNo) {
  try {
    const result = await Model.findOne({ url });
    await result
      .populate({
        path: 'posts',
        match: { status: 'published' },
        options: {
          limit: LIMIT,
          skip: LIMIT * (pageNo - 1),
          sort: { date: 1 },
        },
        populate: { path: 'author' },
      })
      .execPopulate();

    if (!result.posts) return res.status(404).send();
    res.send(result.posts);
  } catch (e) {
    console.log('error');
    res.status(500).send();
  }
};

const serveSelectorPosts = function (req, res) {
  const { pageNo } = req.body;
  const { key, value } = req.params;
  if (key === 'author') {
    return serveAuthorsPosts(res, value, pageNo);
  }
  const models = { category: Category, tag: Tag };
  serveTagsOrCategoriesPosts(res, models[key], value, pageNo);
};

const serveSelectorPagination = async function (req, res) {
  const { key, value } = req.params;
  const models = {
    category: { model: Category, findBy: 'url' },
    tag: { model: Tag, findBy: 'url' },
    author: { model: Author, findBy: 'username' },
  };
  const Model = models[key].model;
  const findBy = {};
  findBy[models[key].findBy] = value;
  try {
    const result = await Model.findOne(findBy);
    await result.populate({ path: 'posts' }).execPopulate();
    const pages = Math.ceil(result.posts.length / LIMIT);
    res.send({ pages });
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = { serveByUrl, serveSelectorPosts, serveSelectorPagination };
