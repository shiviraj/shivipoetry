const { Comment } = require('../models/comment');
const { Post } = require('../models/post');

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
}

module.exports = { Posts: new Posts() };
