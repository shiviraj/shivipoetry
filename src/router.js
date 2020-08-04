const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

require('./db/connectDB');

const { postRouter } = require('./routers/post');
const { postsByRouter } = require('./routers/postsBy');
const { poetRouter } = require('./routers/poet');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../templates'));

app.use(express.static('public'));
app.use(postRouter);
app.use(postsByRouter);
app.use('/poet', poetRouter);

module.exports = { app };
