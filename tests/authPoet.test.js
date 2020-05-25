const request = require('supertest');
const { app } = require('../src/router');

const { authorOne, setupDatabase, cleanupDatabase } = require('./fixtures/db');

describe('AuthPoet', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

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
});
