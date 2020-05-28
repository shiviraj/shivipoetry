const express = require('express');
const cookieParser = require('cookie-parser');

const { auth } = require('../middleware/auth');
const {
  serveIsAvailableUsername,
  registerPoet,
  serveLoginPoet,
} = require('../handlers/poet');

const {
  serveAllCategories,
  serveAllTags,
  addAndServe,
  serveURLAvailability,
  addNewPostAndServe,
} = require('../handlers/authPoet');

const poetRouter = new express.Router();

poetRouter.use(cookieParser());
poetRouter.use('/poet', express.static('public/author'));
poetRouter.post('/poet/username/available', serveIsAvailableUsername);
poetRouter.post('/poet/register', registerPoet);
poetRouter.post('/poet/login', serveLoginPoet);

poetRouter.use('/poet/me', auth, express.static('public/poet/auth'));
poetRouter.get('/poet/me/categories', auth, serveAllCategories);
poetRouter.get('/poet/me/tags', auth, serveAllTags);
poetRouter.post('/poet/me/addNew/:itemToAdd', auth, addAndServe);
poetRouter.post('/poet/me/isURLAvailable', auth, serveURLAvailability);
poetRouter.post('/poet/me/addNewPost', auth, addNewPostAndServe);

module.exports = { poetRouter };
