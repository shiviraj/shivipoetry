const express = require('express');

const {
  serveByUrl,
  serveSelectorPosts,
  serveSelectorPagination,
} = require('../handlers/postsBy');

const selectPosts = new express.Router();

selectPosts.use(/\/(category|tag|author)/, express.static('public'));

selectPosts.get('/posts/pagination/:key/:value', serveSelectorPagination);
selectPosts.post('/posts/:key/:value', serveSelectorPosts);

selectPosts.get('/category/:name', serveByUrl);
selectPosts.get('/tag/:name', serveByUrl);
selectPosts.get('/author/:name', serveByUrl);

module.exports = { postsByRouter: selectPosts };
