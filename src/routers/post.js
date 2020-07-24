const express = require('express');

const {
  servePosts,
  serveNoOfPages,
  serveUrl,
  serveCategories,
  serveTags,
} = require('../handlers/post');

const postRouter = new express.Router();

postRouter.post('/posts', servePosts);
postRouter.get('/posts/pagination', serveNoOfPages);
postRouter.use('/post', express.static('public'));
postRouter.get('/post/:postUrl', serveUrl);
postRouter.get('/categories', serveCategories);
postRouter.get('/tags', serveTags);

module.exports = { postRouter };
