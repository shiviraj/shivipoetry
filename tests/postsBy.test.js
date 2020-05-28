const request = require('supertest');
const { app } = require('../src/router');
const { postOne, setupDatabase, cleanupDatabase } = require('./fixtures/db');

describe('Static page', () => {
  test('Should serve the static page by author', async () => {
    await request(app).get('/author/css/style.css').expect(200);
  });
  test('Should serve the static page by category', async () => {
    await request(app).get('/category/css/style.css').expect(200);
  });
  test('Should serve the static page by tag', async () => {
    await request(app).get('/tag/css/style.css').expect(200);
  });
});

describe('PostBy by url', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('Should serve the template postBy author', async () => {
    await request(app).get('/author/Shivi').expect(200);
  });

  test('Should serve the template postBy tag', async () => {
    await request(app).get('/tag/tag-1').expect(200);
  });

  test('Should serve the template postBy category', async () => {
    await request(app).get('/category/category-1').expect(200);
  });
});

describe('serveSelector posts', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('Should serve the posts by author', async () => {
    const res = await request(app)
      .post('/posts/author/Shivi')
      .send({ pageNo: 1 })
      .expect(200);
    expect(res.body.posts.length).toBe(2);
  });

  test('Should not serve the posts by author if not exists', async () => {
    const res = await request(app)
      .post('/posts/author/notExists')
      .send({ pageNo: 1 })
      .expect(500);
  });

  test('Should serve the posts by tag', async () => {
    const res = await request(app)
      .post('/posts/tag/tag-1')
      .send({ pageNo: 1 })
      .expect(200);
    expect(res.body.length).toBe(2);
  });

  test('Should not serve the posts by tag if not exists', async () => {
    const res = await request(app)
      .post('/posts/tag/notExists')
      .send({ pageNo: 1 })
      .expect(500);
  });
  test('Should serve the posts by category', async () => {
    const res = await request(app)
      .post('/posts/category/category-1')
      .send({ pageNo: 1 })
      .expect(200);
    expect(res.body.length).toBe(2);
  });

  test('Should not serve the posts by category if not exists', async () => {
    const res = await request(app)
      .post('/posts/category/notExists')
      .send({ pageNo: 1 })
      .expect(500);
  });
});

describe('serveSelector pagination', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('Should serve the pagination by author', async () => {
    const res = await request(app)
      .get('/posts/pagination/author/Shivi')
      .expect(200);
    expect(res.body).toMatchObject({ pages: 1 });
  });

  test('Should not serve the pagination by author if not exists', async () => {
    const res = await request(app)
      .get('/posts/pagination/author/notExists')
      .expect(500);
  });

  test('Should serve the pagination by tag', async () => {
    const res = await request(app)
      .get('/posts/pagination/tag/tag-1')
      .expect(200);
    expect(res.body).toMatchObject({ pages: 1 });
  });

  test('Should not serve the pagination by tag if not exists', async () => {
    const res = await request(app)
      .get('/posts/pagination/tag/notExists')
      .expect(500);
  });
  test('Should serve the pagination by category', async () => {
    const res = await request(app)
      .get('/posts/pagination/category/category-1')
      .expect(200);
    expect(res.body).toMatchObject({ pages: 1 });
  });

  test('Should not serve the pagination by category if not exists', async () => {
    await request(app).get('/posts/pagination/category/notExists').expect(500);
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
