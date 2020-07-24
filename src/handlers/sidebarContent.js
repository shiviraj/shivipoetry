const { Post } = require('../models/post');
const { Category } = require('../models/category');
const { Tag } = require('../models/tag');

const recentPosts = async () => {
  return await Post.find({ status: 'published' })
    .sort({ date: -1 })
    .skip(0)
    .limit(10);
};

const categories = async () => {
  return await Category.find({});
};
const tags = async () => {
  return await Tag.find({});
};

const sidebarContent = async () => {
  const content = {};
  content.recentPosts = await recentPosts();
  content.categories = await categories();
  content.tags = await tags();
  return content;
};

module.exports = { sidebarContent };
