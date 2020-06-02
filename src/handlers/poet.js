const { Author } = require('../models/author');
const { clearInvalidTokens } = require('./utils');

const serveIsAvailableUsername = async function (req, res) {
  const { username } = req.body;
  try {
    const result = await Author.findOne({ username });
    const isAvailable = result === null;
    res.send({ isAvailable });
  } catch (e) {
    res.status(500).send();
  }
};

const registerPoet = async function (req, res) {
  const poet = req.body;
  poet.registeredDate = new Date();
  poet.displayName = poet.name;
  try {
    const author = new Author(poet);
    const data = await author.save();
    res.status(201).send(data);
  } catch (e) {
    res.status(400).send();
  }
};

const serveLoginPoet = async function (req, res) {
  const { username, password } = req.body;
  try {
    const author = await Author.findByCredentials(username, password);
    const token = await author.generateAuthToken();
    await clearInvalidTokens(author._id, Author);
    res.cookie('token', `token ${token}`).send();
  } catch (e) {
    res.status(400).send();
  }
};

const logoutFromAccount = async (req, res) => {
  try {
    const tokens = req.author.tokens.filter((token) => {
      return token.token != req.token;
    });
    await Author.findByIdAndUpdate(req.author._id, { tokens });
    await clearInvalidTokens(req.author._id, Author);
    res.redirect('../login.html');
  } catch {
    res.status(500).end();
  }
};

module.exports = {
  serveIsAvailableUsername,
  registerPoet,
  serveLoginPoet,
  logoutFromAccount,
};
