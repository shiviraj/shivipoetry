const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const serveTemplate = function (fileName, res) {
  const pathUrl = path.join(__dirname, `../../templates/${fileName}`);
  fs.readFile(pathUrl, 'utf8', (error, data) => {
    if (error) return res.status(500).send();
    res.send(data);
  });
};

const shuffle = function (array) {
  for (let time = 0; time < 8; time++) {
    array.sort(() => Math.random() - 0.5);
  }
  return array;
};

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

const verifyToken = async function (req, POST_CODE, Post) {
  let token = req.cookies.postToken.replace('postToken ', '');
  const { _id } = jwt.verify(token, POST_CODE);
  const post = await Post.findOne({ _id, 'tokens.token': token });
  const [, url] = req.body.postUrl.split('/');
  if (post.url != url) throw new Error();
  clearTokens(_id, Post);
  return token;
};

const updatePostCount = async function (Post, url, POST_CODE) {
  const post = await Post.findOne({ url });
  const token = jwt.sign({ _id: post._id }, POST_CODE, { expiresIn: 600 });
  const views = post.views + 1;
  const tokens = post.tokens.concat({ token });
  await Post.findByIdAndUpdate(post._id, { views, tokens });
  clearTokens(post._id, Post);
  return token;
};

const updatePostCountAndGetToken = async (req, url, Post) => {
  const { POST_CODE } = process.env;
  try {
    return await verifyToken(req, POST_CODE, Post);
  } catch {
    return await updatePostCount(Post, url, POST_CODE);
  }
};

module.exports = { serveTemplate, shuffle, updatePostCountAndGetToken };
