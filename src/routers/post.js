const express = require('express');

const { servePosts, servePost } = require('../handlers/post');

const postRouter = new express.Router();

postRouter.use(['/post', '/posts/page'], express.static('public'));
postRouter.get(['/', '/posts/page/:page'], servePosts);
postRouter.get('/post/:postUrl', servePost);

module.exports = { postRouter };
