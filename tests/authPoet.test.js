const request = require('supertest');
const { app } = require('../src/router');

const {
  authorOne,
  postOne,
  setupDatabase,
  cleanupDatabase,
} = require('./fixtures/db');

describe('AuthPoet', () => {
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

  test('Should add new category', async () => {
    const res = await request(app)
      .post('/poet/me/addNew/category')
      .send({ category: 'Category 3' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body).toMatchObject({ name: 'Category 3', url: 'category-3' });
  });

  test('Should not  add new category if already exists', async () => {
    await request(app)
      .post('/poet/me/addNew/category')
      .send({ category: 'Category 2' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(404);
  });

  test('Should give server error if request is invalid', async () => {
    await request(app)
      .post('/poet/me/addNew/category')
      .send({ tag: 'Category 2' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(500);
  });

  test('Should add new tag', async () => {
    const res = await request(app)
      .post('/poet/me/addNew/tag')
      .send({ tag: 'Tag 3' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body).toMatchObject({ name: 'Tag 3', url: 'tag-3' });
  });

  test('Should not  add new tag if already exists', async () => {
    await request(app)
      .post('/poet/me/addNew/tag')
      .send({ tag: 'Tag 2' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(404);
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

  test('Should add new post', async () => {
    const res = await request(app)
      .post('/poet/me/addNewPost')
      .send({
        title: 'title',
        content: 'content',
        categories: ['category-1'],
        tags: ['tag-1'],
        status: 'publish',
        url: 'title',
      })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body).toMatchObject({ status: true });
  });

  test('Should save new post as draft', async () => {
    const res = await request(app)
      .post('/poet/me/addNewPost')
      .send({
        title: 'title',
        content: 'content',
        categories: ['category-1'],
        tags: ['tag-1'],
        status: 'draft',
        url: 'title',
      })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body).toMatchObject({ status: true });
  });

  test('Should 500 error if required options are not provided', async () => {
    await request(app)
      .post('/poet/me/addNewPost')
      .send({ title: 'title', content: 'content' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(500);
  });

  test('Should serve my all posts', async () => {
    const res = await request(app)
      .get('/poet/me/myAllPosts')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body[0]).toMatchObject({
      content: 'This is the first post.',
      title: 'Post 1',
      status: 'published',
      url: 'post-1',
      type: 'post',
      commentStatus: 'open',
      commentCount: 0,
    });
  });
});
