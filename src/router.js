const express = require('express');
const cookieParser = require('cookie-parser');

require('./db/connectDB');

const { postRouter } = require('./routers/post');
const { postsByRouter } = require('./routers/postsBy');
const { poetRouter } = require('./routers/poet');
const { authPoetRouter } = require('./routers/authPoet');

const app = express();
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use(postRouter);
app.use(postsByRouter);
app.use('/poet', poetRouter);
app.use('/poet/me', authPoetRouter);

module.exports = { app };
