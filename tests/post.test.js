const request = require('supertest');
const { app } = require('../src/router');
const {
  authorOne,
  postOne,
  categoryOne,
  categoryTwo,
  setupDatabase,
  cleanupDatabase,
} = require('./fixtures/db');

describe('Static page', () => {
  test('Should serve the static page', async () => {
    await request(app).get('/post/css/style.css').expect(200);
  });
});

describe('Server Post', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('Should serve the post content of given url', async () => {
    await request(app)
      .get('/post/post-1')
      .expect(200)
      .expect(/Post 1/);
  });

  test('Should serve 500 error if post not found', async () => {
    await request(app).get('/post/not-found').expect(500);
  });

  test('Should serve the post content of given url with token', async () => {
    await request(app)
      .get('/post/post-1')
      .set('Cookie', `postToken=postToken ${postOne.tokens[0].token}`)
      .expect(200);
  });

  test('Should serve the post content of given url with expired token', async () => {
    await request(app)
      .get('/post/post-1')
      .set('Cookie', `postToken=postToken ${postOne.tokens[1].token}`)
      .expect(200);
  });

  test('Should serve the post content of given url token is not there', async () => {
    await request(app)
      .get('/post/post-1')
      .set('Cookie', `postToken=postToken ${authorOne.tokens[0].token}`)
      .expect(200);
  });

  test('Should serve 500 error if post not found', async () => {
    await request(app)
      .get('/post/not-found')
      .set('Cookie', `postToken=postToken ${postOne.tokens[0].token}`)
      .expect(500);
  });
});

describe('Post content by url', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('Should update post views and serve the post content by given url', async () => {
    await request(app)
      .get('/post/post-1')
      .set('Cookie', `postToken=postToken ${postOne.tokens[0].token}`)
      .expect(200);
  });

  test('Should update post views and serve the post content by given url if token in expired', async () => {
    await request(app)
      .get('/post/post-1')
      .set('Cookie', `postToken=postToken ${postOne.tokens[1].token}`)
      .expect(200);
  });
});

describe('Sidebar related things', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('Should serve all categories', async () => {
    await request(app).get('/categories').expect(200);
  });

  test('Should serve all tags', async () => {
    await request(app).get('/tags').expect(200);
  });
});
