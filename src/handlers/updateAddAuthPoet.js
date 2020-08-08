const { Categories, Tags } = require('./tagsAndCategories');
const { Posts } = require('./posts');

const addAndServe = async function (req, res) {
  try {
    const name = req.body[req.params.item];
    if (req.params.item === 'category') {
      const category = await Categories.add(name);
      return res.send(category);
    }
    const tag = await Tags.add(name);
    res.send(tag);
  } catch {
    res.status(500).end();
  }
};

const addNewPostAndServe = async function (req, res) {
  try {
    await Posts.add(req.body, req.author._id);
    res.send({ status: true });
  } catch {
    res.status(500).send();
  }
};

const updatePostAndServe = async (req, res) => {
  try {
    const { _id, ...postOptions } = req.body;
    const post = await Posts.update({ _id }, postOptions);
    if (post) return res.send({ status: true });
    res.status(422).send({ status: false });
  } catch {
    res.status(500).end();
  }
};

const publishPostAndServe = async (req, res) => {
  const post = await Posts.publish(req.params.url);
  if (post) return res.send({ status: true });
  res.status(422).send({ status: false });
};

const deletePostAndServe = async (req, res) => {
  const post = await Posts.delete(req.params.url);
  if (post) return res.send({ status: true });
  res.status(422).send({ status: false });
};

module.exports = {
  addAndServe,
  addNewPostAndServe,
  updatePostAndServe,
  publishPostAndServe,
  deletePostAndServe,
};
