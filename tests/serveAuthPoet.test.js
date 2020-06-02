const request = require('supertest');
const { app } = require('../src/router');

const {
  postOne,
  postThree,
  authorOne,
  setupDatabase,
  cleanupDatabase,
} = require('./fixtures/db');

describe('ServeAuthPoet', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('Should serve my details', async () => {
    const res = await request(app)
      .get('/poet/me/i')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body).toMatchObject({
      name: 'Shivam Rajput',
      email: 'shivi@example.com',
      displayName: 'Shivam Rajput',
    });
  });

  test('Should serve all Categories', async () => {
    const res = await request(app)
      .get('/poet/me/categories')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body[0]).toMatchObject({
      name: 'Category 1',
      url: 'category-1',
    });
  });

  test('Should serve all tags', async () => {
    const res = await request(app)
      .get('/poet/me/tags')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body[0]).toMatchObject({ name: 'Tag 1', url: 'tag-1' });
  });

  test('Should give URL availability true if url is not in database', async () => {
    const res = await request(app)
      .post('/poet/me/isURLAvailable')
      .send({ url: 'new-url' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body).toMatchObject({ isAvailable: true });
  });

  test('Should give URL availability false if url is in database', async () => {
    const res = await request(app)
      .post('/poet/me/isURLAvailable')
      .send({ url: 'post-1' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body).toMatchObject({ isAvailable: false });
  });

  test('Should serve my all posts', async () => {
    const res = await request(app)
      .get('/poet/me/myAllPosts')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body.length).toBe(2);
  });

  test('Should serve the details of posts', async () => {
    const res = await request(app)
      .post('/poet/me/post')
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
      .post('/poet/me/post')
      .send({ url: 'post-2' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(500);
  });
});