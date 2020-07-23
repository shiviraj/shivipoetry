const express = require('express');

const {
  serveIsAvailableUsername,
  registerPoet,
  serveLoginPoet,
} = require('../handlers/poet');

const poetRouter = new express.Router();

poetRouter.use('/', express.static('public/author'));
poetRouter.post('/username/available', serveIsAvailableUsername);
poetRouter.post('/register', registerPoet);
poetRouter.post('/login', serveLoginPoet);

module.exports = { poetRouter };
