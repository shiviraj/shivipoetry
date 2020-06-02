const express = require('express');

const { auth } = require('../middleware/auth');
const {
  serveIsAvailableUsername,
  registerPoet,
  serveLoginPoet,
} = require('../handlers/poet');

const {
  addAndServe,
  addNewPostAndServe,
  updatePostAndServe,
  publishPostAndServe,
  deletePostAndServe,
} = require('../handlers/updateAddAuthPoet');

const {
  serveAllCategories,
  serveAllTags,
  serveURLAvailability,
  serveAllPosts,
  servePost,
} = require('../handlers/serveAuthPoet');

const poetRouter = new express.Router();

poetRouter.use('/poet', express.static('public/author'));
poetRouter.post('/poet/username/available', serveIsAvailableUsername);
poetRouter.post('/poet/register', registerPoet);
poetRouter.post('/poet/login', serveLoginPoet);

poetRouter.use('/poet/me', auth, express.static('public/poet/auth'));
poetRouter.use('/poet/me/i', auth, (req, res) => res.send(req.author));
poetRouter.get('/poet/me/categories', auth, serveAllCategories);
poetRouter.get('/poet/me/tags', auth, serveAllTags);
poetRouter.put('/poet/me/addNew/:itemToAdd', auth, addAndServe);
poetRouter.post('/poet/me/isURLAvailable', auth, serveURLAvailability);
poetRouter.put('/poet/me/addNewPost', auth, addNewPostAndServe);
poetRouter.get('/poet/me/myAllPosts', auth, serveAllPosts);
poetRouter.post('/poet/me/post', auth, servePost);
poetRouter.post('/poet/me/updatePost', auth, updatePostAndServe);
poetRouter.post('/poet/me/publishPost', auth, publishPostAndServe);
poetRouter.delete('/poet/me/deletePost', auth, deletePostAndServe);

module.exports = { poetRouter };
