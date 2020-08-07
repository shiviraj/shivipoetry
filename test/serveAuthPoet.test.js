const request = require('supertest');
const { app } = require('../src/router');

const {
  postOne,
  postThree,
  authorOne,
  commentOneId,
  commentTwoId,
  setupDatabase,
  cleanupDatabase,
} = require('./fixtures/db');

describe('ServeAuthPoet', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('Should give URL availability true if url is not in database', async () => {
    const res = await request(app)
      .post('/poet/isURLAvailable')
      .send({ url: 'new-url' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body).toMatchObject({ isAvailable: true });
  });

  test('Should give URL availability false if url is in database', async () => {
    const res = await request(app)
      .post('/poet/isURLAvailable')
      .send({ url: 'post-1' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body).toMatchObject({ isAvailable: false });
  });

  test('Should serve my all posts', async () => {
    const res = await request(app)
      .get('/poet/myAllPosts')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body.length).toBe(2);
  });

  test('Should serve the details of posts', async () => {
    const res = await request(app)
      .post('/poet/post')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .send({ url: 'post-1' })
      .expect(200);
    expect(res.body).toMatchObject({
      content: 'This is the first post.',
      title: 'Post 1',
      status: 'published',
      url: 'post-1',
      type: 'post',
      commentStatus: 'open',
      commentCount: 0,
    });
  });

  test('Should give error the post does not belongs to author', async () => {
    await request(app)
      .post('/poet/post')
      .send({ url: 'post-2' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(404);
  });

  test('Should give editor to edit a post', async () => {
    await request(app)
      .get('/poet/edit/post-1')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200)
      .expect(/Edit Post/);
  });

  test('Should serve the comment with all comments', async () => {
    await request(app)
      .get('/poet/comment')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200)
      .expect(/Comment/);
  });

  test('Should approve comment', async () => {
    await request(app)
      .get(`/poet/comment/approved/${commentOneId}`)
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(302)
      .expect('Location', '/poet/comment');
  });

  test('Should unapproved comment', async () => {
    await request(app)
      .get(`/poet/comment/unapproved/${commentTwoId}`)
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(302)
      .expect('Location', '/poet/comment');
  });

  test('Should delete comment', async () => {
    await request(app)
      .get(`/poet/comment/delete/${commentTwoId}`)
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(302)
      .expect('Location', '/poet/comment');
  });
});
