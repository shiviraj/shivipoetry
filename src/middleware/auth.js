const jwt = require('jsonwebtoken');
const { Author } = require('../models/author');

const auth = async function (req, res, next) {
  try {
    const token = req.cookies.token.replace('token ', '');
    const { _id } = jwt.verify(token, process.env.SECRET_CODE);
    const author = await Author.findOne({ _id, 'tokens.token': token });
    req.token = token;
    req.author = author;
    next();
  } catch (e) {
    res.redirect('../login.html');
  }
};

module.exports = { auth };
