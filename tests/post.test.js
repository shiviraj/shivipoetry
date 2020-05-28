const request = require('supertest');
const { app } = require('../src/router');
const { postOne, setupDatabase, cleanupDatabase } = require('./fixtures/db');

describe('Post', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('Should serve the posts according to page no', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ pageNo: 1 })
      .expect(200);
    expect(res.body.length).toBe(3);
  });

  test('Should serve the posts if page no is not exists', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ pageNo: 9 })
      .expect(200);
    expect(res.body.length).toBe(0);
  });

  test('Should serve the pagination of posts', async () => {
    const res = await request(app).get('/posts/pagination').expect(200);
    expect(res.body).toMatchObject({ pages: 1 });
  });
});

describe('Static page', () => {
  test('Should serve the static page', async () => {
    await request(app).get('/post/css/style.css').expect(200);
  });
});

describe('Post content', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('Should serve the post content of given url', async () => {
    const res = await request(app)
      .post('/post/content')
      .send({ postUrl: 'post/post-1' })
      .expect(200);
    expect(res.body.url).toBe('post-1');
  });

  test('Should serve 500 error if post not found', async () => {
    await request(app)
      .post('/post/content')
      .send({ postUrl: 'post/not-found' })
      .expect(500);
  });
});

describe('Related posts', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('Should serve related post ', async () => {
    const res = await request(app).get('/post/relatedPost').expect(200);
    expect(res.body.length).toBe(3);
  });

  // test('Should serve 500 error if post not found', async () => {
  //   await request(app)
  //     .post('/post/content')
  //     .send({postUrl: 'post/not-found'})
  //     .expect(500);
  // });
});

describe('Post content by url', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('Should serve the post content by given url', async () => {
    await request(app).get('/post/post-1').expect(200);
  });
});
