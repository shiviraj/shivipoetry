const express = require('express');

const {
  servePosts,
  servePost,
  addCommentAndServe,
} = require('../handlers/post');

const postRouter = new express.Router();

postRouter.use(['/post', '/posts/page'], express.static('public'));
postRouter.get(['/', '/posts/page/:page'], servePosts);
postRouter.get('/post/:postUrl', servePost);
postRouter.post('/comment', addCommentAndServe);

module.exports = { postRouter };
