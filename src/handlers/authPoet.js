const { Category } = require('../models/category');
const { Tag } = require('../models/tag');

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

module.exports = { serveAllCategories, serveAllTags, addAndServe };
