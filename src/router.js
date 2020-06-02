const express = require('express');
const cookieParser = require('cookie-parser');

require('./db/connectDB');
const { postRouter } = require('./routers/post');
const { postsByRouter } = require('./routers/postsBy');
const { poetRouter } = require('./routers/poet');

const app = express();
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(postRouter);
app.use(postsByRouter);
app.use(poetRouter);

module.exports = { app };
