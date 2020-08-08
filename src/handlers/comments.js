const { Comment } = require('../models/comment');
const { Post } = require('../models/post');

class Comments {
  constructor() {}

  async add(details) {
    const comment = new Comment(details);
    await comment.save();
  }

  async getAllWithPost(authorId) {
    const fields = ['_id', 'title', 'url'];
    const posts = await Post.find({ author: authorId }).select(fields);
    return await Promise.all(
      posts.map(async (post) => {
        post.comments = await Comment.find({ post: post._id });
        return post;
      })
    );
  }

  async delete(id) {
    await Comment.findByIdAndDelete(id);
  }

  async update(id, status) {
    await Comment.findByIdAndUpdate(id, { status });
  }
}

module.exports = { Comments: new Comments() };
