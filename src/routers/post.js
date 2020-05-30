const express = require('express');

const {
  servePosts,
  serveNoOfPages,
  serveUrl,
  servePostContent,
  serveRelatedPosts,
  serveCategories,
  serveTags,
} = require('../handlers/post');

const postRouter = new express.Router();

postRouter.post('/posts', servePosts);
postRouter.get('/posts/pagination', serveNoOfPages);
postRouter.use('/post', express.static('public'));
postRouter.post('/post/content', servePostContent);
postRouter.get('/post/relatedPost', serveRelatedPosts);
postRouter.get('/post/:postUrl', serveUrl);
postRouter.get('/categories', serveCategories);
postRouter.get('/tags', serveTags);

module.exports = { postRouter };
