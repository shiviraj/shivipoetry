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

  test('Should not serve the posts by author if not exists', async () => {
    await request(app).get('/author/notExists').expect(500);
  });

  test('Should serve the posts by tag', async () => {
    await request(app).get('/tag/tag-1').expect(200);
  });

  test('Should not serve the posts by tag if not exists', async () => {
    const res = await request(app).get('/tag/notExists').expect(500);
  });
  test('Should serve the posts by category', async () => {
    await request(app).get('/category/category-1').expect(200);
  });

  test('Should not serve the posts by category if not exists', async () => {
    await request(app).get('/category/notExists').expect(500);
  });
});
