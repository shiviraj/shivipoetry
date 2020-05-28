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

const addAndServe = async function (req, res) {
  const models = { category: Category, tag: Tag };
  const itemToAdd = req.params.itemToAdd;
  try {
    const name = req.body[itemToAdd];
    const Model = models[itemToAdd];
    const url = name.toLowerCase().split(' ').join('-');
    const items = await Model.find({ url });
    if (items.length) res.status(404).end();
    const model = new Model({ name, url });
    const result = await model.save();
    res.send(result);
  } catch {
    res.status(500).end();
  }
};

const serveURLAvailability = async function (req, res) {
  try {
    const result = await Post.find({ url: req.body.url });
    res.send({ isAvailable: result.length == 0 });
  } catch {
    res.status(500).send();
  }
};

const getIds = async (array, Model) => {
  return await Promise.all(
    array.map(async (url) => {
      const result = await Model.findOne({ url });
      return result['_id'];
    })
  );
};

const addNewPostAndServe = async function (req, res) {
  try {
    const postOptions = req.body;
    postOptions.categories = await getIds(postOptions.categories, Category);
    postOptions.tags = await getIds(postOptions.tags, Tag);
    postOptions.author = mongodb.ObjectID(req.author['_id']);
    postOptions.date = new Date();
    const post = new Post(postOptions);
    await post.save();
    res.send({ status: true });
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
      .sort({ date: 1 });
    res.send(result);
  } catch {
    res.status(500).send();
  }
};

module.exports = {
  serveAllCategories,
  serveAllTags,
  addAndServe,
  serveURLAvailability,
  addNewPostAndServe,
  serveAllPosts,
};
