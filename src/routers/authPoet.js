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
  serveComments,
  deleteComment,
  updateComment,
  serveURLAvailability,
} = require('../handlers/serveAuthPoet');

const authPoetRouter = new express.Router();
authPoetRouter.use(auth);
authPoetRouter.use('/', express.static('public/poet'));

authPoetRouter.get('/', serveDashboard);
authPoetRouter.get('/addPost', serveEditor);
authPoetRouter.get('/edit/:url', serveEditorWithPost);
authPoetRouter.get('/comment', serveComments);
authPoetRouter.get('/comment/delete/:id', deleteComment);
authPoetRouter.get('/comment/:status/:id', updateComment);
authPoetRouter.get('/logout', logoutFromAccount);
authPoetRouter.put('/addNew/:item', addAndServe);
authPoetRouter.post('/isURLAvailable', serveURLAvailability);
authPoetRouter.put('/addNewPost', addNewPostAndServe);
authPoetRouter.post('/updatePost', updatePostAndServe);
authPoetRouter.post('/publish/:url', publishPostAndServe);
authPoetRouter.delete('/deletePost/:url', deletePostAndServe);

module.exports = { authPoetRouter };
