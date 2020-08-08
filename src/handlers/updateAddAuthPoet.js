const mongodb = require('mongodb');
const { Categories, Tags } = require('./tagsAndCategories');
const { Posts } = require('./posts');

const addAndServe = async function (req, res) {
  try {
    const name = req.body[req.params.item];
    const url = name.toLowerCase().split(' ').join('-');
    if (req.params.item === 'category') {
      const category = await Categories.add(name, url);
      return res.send(category);
    }
    const tag = await Tags.add(name, url);
    res.send(tag);
  } catch {
    res.status(500).end();
  }
};

const addNewPostAndServe = async function (req, res) {
  try {
    const postOptions = req.body;
    postOptions.categories = await Categories.getIds(postOptions.categories);
    postOptions.tags = await Tags.getIds(postOptions.tags);
    postOptions.author = mongodb.ObjectID(req.author['_id']);
    postOptions.date = new Date();
    await Posts.add(postOptions);
    res.send({ status: true });
  } catch {
    res.status(500).send();
  }
};

const updatePostAndServe = async (req, res) => {
  try {
    const { _id, ...postOptions } = req.body;
    postOptions.categories = await Categories.getIds(postOptions.categories);
    postOptions.tags = await Tags.getIds(postOptions.tags);
    postOptions.modified = new Date();
    const post = await Posts.update({ _id }, postOptions);
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
  const post = await Posts.update(findOption, valuesToUpdate);
  if (post) {
    return res.send({ status: true });
  }
  res.status(422).send({ status: false });
};

const deletePostAndServe = async (req, res) => {
  const post = await Posts.delete(req.params.url);
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
