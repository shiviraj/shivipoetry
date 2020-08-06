const mongodb = require('mongodb');
const { Category } = require('../models/category');
const { Tag } = require('../models/tag');
const { Post } = require('../models/post');

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

const updatePostAndServe = async (req, res) => {
  try {
    const { _id, ...postOptions } = req.body;
    postOptions.categories = await getIds(postOptions.categories, Category);
    postOptions.tags = await getIds(postOptions.tags, Tag);
    postOptions.modified = new Date();
    const post = await Post.findByIdAndUpdate(_id, postOptions);
    if (post) {
      return res.send({ status: true });
    }
    res.status(422).send({ status: false });
  } catch {
    res.status(500).end();
  }
};

const publishPostAndServe = async (req, res) => {
  const valuesToUpdate = { status: 'published', date: new Date() };
  const findOption = { url: req.params.url };
  const post = await Post.findOneAndUpdate(findOption, valuesToUpdate);
  if (post) {
    return res.send({ status: true });
  }
  res.status(422).send({ status: false });
};

const deletePostAndServe = async (req, res) => {
  const post = await Post.findOneAndDelete({ url: req.params.url });
  if (post) {
    return res.send({ status: true });
  }
  res.status(422).send({ status: false });
};

module.exports = {
  addAndServe,
  addNewPostAndServe,
  updatePostAndServe,
  publishPostAndServe,
  deletePostAndServe,
};
