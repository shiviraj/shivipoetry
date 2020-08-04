const express = require('express');

const { servePosts } = require('../handlers/postsBy');

const selectPosts = new express.Router();

selectPosts.use(/\/(category|tag|author)/, express.static('public'));

selectPosts.get(['/category/:name', '/category/:name/:page'], servePosts);
selectPosts.get(['/tag/:name', '/tag/:name/:page'], servePosts);
selectPosts.get(['/author/:name', '/author/:name/:page'], servePosts);

module.exports = { postsByRouter: selectPosts };
