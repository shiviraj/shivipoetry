const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Author } = require('../../src/models/author');
const { Post } = require('../../src/models/post');
const { Tag } = require('../../src/models/tag');
const { Category } = require('../../src/models/category');
const { Comment } = require('../../src/models/comment');

const authorOneId = new mongoose.Types.ObjectId();
const authorOne = {
  _id: authorOneId,
  name: 'Shivam Rajput',
  username: 'Shivi',
  email: 'shivi@example.com',
  status: 'approved',
  password: 'Shivi@123',
  displayName: 'Shivam Rajput',
  tokens: [{ token: jwt.sign({ _id: authorOneId }, process.env.SECRET_CODE) }],
};

const authorTwoId = new mongoose.Types.ObjectId();

const authorTwo = {
  _id: authorTwoId,
  name: 'Shivam Rajput',
  username: 'Shiviraj',
  email: 'shiviraj@example.com',
  password: '56what!!',
  displayName: 'Shivam Rajput',
  tokens: [{ token: jwt.sign({ _id: authorTwoId }, process.env.SECRET_CODE) }],
};

const postOneId = new mongoose.Types.ObjectId();
const postTwoId = new mongoose.Types.ObjectId();
const postThreeId = new mongoose.Types.ObjectId();
const tagOneId = new mongoose.Types.ObjectId();
const tagTwoId = new mongoose.Types.ObjectId();
const categoryOneId = new mongoose.Types.ObjectId();
const categoryTwoId = new mongoose.Types.ObjectId();

const tagOne = { _id: tagOneId, name: 'Tag 1', url: 'tag-1' };
const tagTwo = { _id: tagTwoId, name: 'Tag 2', url: 'tag-2' };

const categoryOne = {
  _id: categoryOneId,
  name: 'Category 1',
  url: 'category-1',
};
const categoryTwo = {
  _id: categoryTwoId,
  name: 'Category 2',
  url: 'category-2',
};

const postOne = {
  _id: postOneId,
  author: authorOneId,
  date: new Date('2020-03-25'),
  content: 'This is the first post.',
  title: 'Post 1',
  status: 'published',
  url: 'post-1',
  type: 'post',
  commentStatus: 'open',
  commentCount: 0,
  tags: [tagOneId, tagTwoId],
  categories: [categoryOneId, categoryTwoId],
  tokens: [
    { token: jwt.sign({ _id: postOneId }, process.env.POST_CODE) },
    {
      token: jwt.sign({ _id: postOneId }, process.env.POST_CODE, {
        expiresIn: 0,
      }),
    },
  ],
  views: 0,
};

const postTwo = {
  _id: postTwoId,
  author: authorTwoId,
  date: new Date('2020-03-27'),
  content: 'This is the second post.',
  title: 'Post 2',
  status: 'published',
  url: 'post-2',
  type: 'post',
  commentStatus: 'open',
  commentCount: 4,
  tags: [tagOneId],
  categories: [categoryOneId],
  tokens: [],
  views: 0,
};

const postThree = {
  _id: postThreeId,
  author: authorOneId,
  date: new Date('2020-03-30'),
  content: 'This is the third post.',
  title: 'Post 3',
  status: 'published',
  url: 'post-3',
  type: 'post',
  commentStatus: 'open',
  commentCount: 5,
  tags: [tagTwoId],
  categories: [categoryTwoId],
  tokens: [],
  views: 0,
};

const commentOneId = new mongoose.Types.ObjectId();

const commentOne = {
  _id: commentOneId,
  post: postOneId,
  time: new Date('2020-03-30'),
  name: 'Shivi',
  status: 'unapproved',
  msg: 'This is awesome',
};

const commentTwoId = new mongoose.Types.ObjectId();

const commentTwo = {
  _id: commentTwoId,
  post: postTwoId,
  time: new Date('2020-03-30'),
  name: 'Shivi',
  status: 'unapproved',
  msg: 'This is awesome',
};

const setupDatabase = async function () {
  await new Author(authorOne).save();
  await new Author(authorTwo).save();
  await new Post(postOne).save();
  await new Post(postTwo).save();
  await new Post(postThree).save();
  await new Tag(tagOne).save();
  await new Tag(tagTwo).save();
  await new Category(categoryOne).save();
  await new Category(categoryTwo).save();
  await new Comment(commentOne).save();
  await new Comment(commentTwo).save();
};

const cleanupDatabase = async function () {
  await Author.deleteMany();
  await Post.deleteMany();
  await Tag.deleteMany();
  await Category.deleteMany();
  await Comment.deleteMany();
};

module.exports = {
  categoryOne,
  categoryTwo,
  postOneId,
  authorOneId,
  authorOne,
  authorTwoId,
  authorTwo,
  postOne,
  postTwo,
  postThree,
  commentOneId,
  commentTwoId,
  setupDatabase,
  cleanupDatabase,
};
