const express = require('express');

const { servePosts } = require('../handlers/postsBy');

const selectPosts = new express.Router();

selectPosts.use(/\/(category|tag|author)/, express.static('public'));

const routes = [
  '/category/:name',
  '/category/:name/:page',
  '/tag/:name',
  '/tag/:name/:page',
  '/author/:name',
  '/author/:name/:page',
];

selectPosts.get(routes, servePosts);

module.exports = { postsByRouter: selectPosts };
