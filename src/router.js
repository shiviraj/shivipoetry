const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const moment = require('moment');

require('./db/connectDB');

const { postRouter } = require('./routers/post');
const { postsByRouter } = require('./routers/postsBy');
const { poetRouter } = require('./routers/poet');
const { authPoetRouter } = require('./routers/authPoet');

const app = express();

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

hbs.registerPartials(partialsPath);
hbs.registerHelper({
  dateFormat: (date) => moment(date).format('MMM DD, YYYY hh:mm:ss A'),
  truncate: (content) => content.slice(0, 150),
});
app.set('view engine', 'hbs');
app.set('views', viewsPath);

app.use(postRouter);
app.use(postsByRouter);
app.use('/poet', poetRouter);
app.use('/poet/me', authPoetRouter);

module.exports = { app };
