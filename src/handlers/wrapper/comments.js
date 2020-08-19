const { Comment } = require('../../models/comment');
const { Posts } = require('./posts');

class Comments {
  constructor() {}

  async add(details) {
    const comment = new Comment(details);
    await comment.save();
  }

  async getAllWithPost(authorId) {
    const posts = await Posts.getPostsByAuthor(authorId);
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
