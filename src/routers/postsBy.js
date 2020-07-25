const express = require('express');

const {
  servePosts,
  serveSelectorPosts,
  serveSelectorPagination,
} = require('../handlers/postsBy');

const selectPosts = new express.Router();

selectPosts.use(/\/(category|tag|author)/, express.static('public'));

selectPosts.get('/posts/pagination/:key/:value', serveSelectorPagination);
selectPosts.post('/posts/:key/:value', serveSelectorPosts);

selectPosts.get('/category/:name', servePosts);
selectPosts.get('/tag/:name', servePosts);
selectPosts.get('/author/:name', servePosts);

module.exports = { postsByRouter: selectPosts };
