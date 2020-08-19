const mongodb = require('mongodb');
const { Comment } = require('../../models/comment');
const { Post } = require('../../models/post');
const { Categories, Tags } = require('./tagsAndCategories');

const shuffle = function (array) {
  for (let time = 0; time < 8; time++) {
    array.sort(() => Math.random() - 0.5);
  }
  return array;
};

class Posts {
  constructor() {
    this.number = 10;
  }

  async getTotalPages() {
    const totalPosts = await Post.countDocuments({ status: 'published' });
    return Math.ceil(totalPosts / this.number);
  }

  async getPosts(page = 1) {
    const pages = await this.getTotalPages(this.number);
    if (page < 1 || page > pages) {
      throw new Error('post not found');
    }
    return await Post.find({ status: 'published' })
      .populate('author', ['displayName', 'username'])
      .sort({ date: -1 })
      .skip((page - 1) * this.number)
      .limit(this.number);
  }

  async getPostByUrl(url) {
    const post = await Post.findOne({ url });
    await post
      .populate('author', ['displayName', 'username'])
      .populate('tags', ['name', 'url'])
      .populate('categories', ['name', 'url'])
      .execPopulate();
    const comments = await Comment.find({ post: post._id, status: 'approved' });
    return Object.assign(post, { comments });
  }

  async getRandomPost() {
    const posts = await Post.find({
      status: 'published',
    }).populate('author', ['displayName', 'username']);
    return shuffle(posts).slice(0, 4);
  }

  async getPostsByAuthor(authorId) {
    return await Post.find({ author: authorId })
      .populate('author', ['displayName', 'username'])
      .populate('tags', ['name', 'url'])
      .populate('categories', ['name', 'url'])
      .sort({ date: -1 });
  }

  async getPostByUrlAndAuthor(url, authorId) {
    const post = await Post.findOne({ url, author: authorId });
    return await post
      .populate('tags', ['name', 'url'])
      .populate('categories', ['name', 'url'])
      .execPopulate();
  }
  async isUrlAvailable(url, currentUrl) {
    const post = await Post.findOne({ url });
    return !post || post.url == currentUrl;
  }

  async add(details, authorId) {
    details.categories = await Categories.getIds(details.categories);
    details.tags = await Tags.getIds(details.tags);
    details.author = mongodb.ObjectID(authorId);
    details.date = new Date();
    const post = new Post(details);
    await post.save();
  }

  async update(id, details) {
    details.categories = await Categories.getIds(details.categories);
    details.tags = await Tags.getIds(details.tags);
    details.modified = new Date();
    return await Post.findByIdAndUpdate(id, details);
  }

  async publish(url) {
    const valuesToUpdate = { status: 'published', date: new Date() };
    return await Post.findOneAndUpdate({ url }, valuesToUpdate);
  }

  async delete(url) {
    return await Post.findOneAndDelete({ url });
  }
}

module.exports = { Posts: new Posts() };
