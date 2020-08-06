const express = require('express');
const { auth } = require('../middleware/auth');

const { logoutFromAccount } = require('../handlers/poet');

const {
  addAndServe,
  addNewPostAndServe,
  updatePostAndServe,
  publishPostAndServe,
  deletePostAndServe,
} = require('../handlers/updateAddAuthPoet');

const {
  serveDashboard,
  serveEditor,
  serveEditorWithPost,
  serveAllCategories,
  serveAllTags,
  serveURLAvailability,
  serveAllPosts,
  servePost,
} = require('../handlers/serveAuthPoet');

const authPoetRouter = new express.Router();
authPoetRouter.use(auth);
authPoetRouter.use('/', express.static('public/poet'));

authPoetRouter.get('/dashboard', serveDashboard);
authPoetRouter.get('/addPost', serveEditor);
authPoetRouter.get('/edit/:url', serveEditorWithPost);
authPoetRouter.get('/logout', logoutFromAccount);
authPoetRouter.get('/categories', serveAllCategories);
authPoetRouter.get('/tags', serveAllTags);
authPoetRouter.put('/addNew/:itemToAdd', addAndServe);
authPoetRouter.post('/isURLAvailable', serveURLAvailability);
authPoetRouter.put('/addNewPost', addNewPostAndServe);
authPoetRouter.get('/myAllPosts', serveAllPosts);
authPoetRouter.post('/post', servePost);
authPoetRouter.post('/updatePost', updatePostAndServe);
authPoetRouter.post('/publishPost', publishPostAndServe);
authPoetRouter.delete('/deletePost', deletePostAndServe);

module.exports = { authPoetRouter };
