const jwt = require('jsonwebtoken');
const { Post } = require('../models/post');

const filterValidTokens = (secretCode) => {
  return (token) => {
    try {
      jwt.verify(token.token, secretCode);
      return true;
    } catch {}
  };
};

const clearTokens = async (id, Post) => {
  const post = await Post.findById(id);
  const tokens = post.tokens.filter(filterValidTokens(process.env.POST_CODE));
  await Post.findByIdAndUpdate(id, { tokens });
};

const verifyToken = async function (req, POST_CODE, url) {
  let token = req.cookies.postToken.replace('postToken ', '');
  const { _id } = jwt.verify(token, POST_CODE);
  const post = await Post.findOne({ _id, 'tokens.token': token });
  if (post.url != url) throw new Error();
  clearTokens(_id, Post);
  return token;
};

const updatePostCount = async function (url, POST_CODE) {
  const post = await Post.findOne({ url });
  const token = jwt.sign({ _id: post._id }, POST_CODE, { expiresIn: 600 });
  const views = post.views + 1;
  const tokens = post.tokens.concat({ token });
  await Post.findByIdAndUpdate(post._id, { views, tokens });
  clearTokens(post._id, Post);
  return token;
};

const updatePostCountAndGetToken = async (req, url) => {
  const { POST_CODE } = process.env;
  try {
    return await verifyToken(req, POST_CODE, url);
  } catch {
    return await updatePostCount(url, POST_CODE);
  }
};

const clearInvalidTokens = async function (id, Author) {
  const { SECRET_CODE } = process.env;
  const author = await Author.findById(id);
  const tokens = author.tokens.filter(filterValidTokens(SECRET_CODE));
  await Author.findByIdAndUpdate(id, { tokens });
};

module.exports = { updatePostCountAndGetToken, clearInvalidTokens };
