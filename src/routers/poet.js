const express = require('express');
const cookieParser = require('cookie-parser');

const { auth } = require('../middleware/auth');
const {
  serveIsAvailableUsername,
  registerPoet,
  serveLoginPoet,
} = require('../handlers/poet');

const poetRouter = new express.Router();

poetRouter.use(cookieParser());
poetRouter.use('/poet', express.static('public/author'));
poetRouter.post('/poet/username/available', serveIsAvailableUsername);
poetRouter.post('/poet/register', registerPoet);
poetRouter.post('/poet/login', serveLoginPoet);

poetRouter.use('/author/me', auth, express.static('public/author/auth'));

module.exports = { poetRouter };
