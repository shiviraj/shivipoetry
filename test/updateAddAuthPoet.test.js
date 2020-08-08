const request = require('supertest');
const { app } = require('../src/router');

const {
  authorOne,
  authorOneId,
  postOneId,
  setupDatabase,
  cleanupDatabase,
} = require('./fixtures/db');

describe('UpdateAddAuthPoet', function () {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('Should add new category', async () => {
    const res = await request(app)
      .put('/poet/addNew/category')
      .send({ category: 'Category 3' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body).toMatchObject({ name: 'Category 3', url: 'category-3' });
  });

  test('Should not add new category if already exists', async () => {
    await request(app)
      .put('/poet/addNew/category')
      .send({ category: 'Category 2' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(500);
  });

  test('Should give server error if request is invalid', async () => {
    await request(app)
      .put('/poet/addNew/category')
      .send({ tag: 'Category 2' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(500);
  });

  test('Should add new tag', async () => {
    const res = await request(app)
      .put('/poet/addNew/tag')
      .send({ tag: 'Tag 3' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
    expect(res.body).toMatchObject({ name: 'Tag 3', url: 'tag-3' });
  });

  test('Should not add new tag if already exists', async () => {
    await request(app)
      .put('/poet/addNew/tag')
      .send({ tag: 'Tag 2' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(500);
  });

  test('Should add new post', async () => {
    await request(app)
      .put('/poet/addNewPost')
      .send({
        title: 'title',
        content: 'content',
        categories: ['category-1'],
        tags: ['tag-1'],
        status: 'publish',
        url: 'title',
      })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200)
      .expect({ status: true });
  });

  test('Should save new post as draft', async () => {
    await request(app)
      .put('/poet/addNewPost')
      .send({
        title: 'title',
        content: 'content',
        categories: ['category-1'],
        tags: ['tag-1'],
        status: 'draft',
        url: 'title',
      })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200)
      .expect({ status: true });
  });

  test('Should 500 error if required options are not provided', async () => {
    await request(app)
      .put('/poet/addNewPost')
      .send({ title: 'title', content: 'content' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(500);
  });

  test('Should update post by author', async () => {
    await request(app)
      .post('/poet/updatePost')
      .send({ _id: postOneId, title: 'new title', categories: [], tags: [] })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200)
      .expect({ status: true });
  });

  test('Should not update post with invalid id', async () => {
    await request(app)
      .post('/poet/updatePost')
      .send({ _id: authorOneId, title: 'new title', categories: [], tags: [] })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(422)
      .expect({ status: false });
  });

  test('Should give server error if post url is not unique', async () => {
    await request(app)
      .post('/poet/updatePost')
      .send({ url: 'post-1', title: 'new title' })
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(500);
  });

  test('Should publish the post of given url', async () => {
    await request(app)
      .post('/poet/publish/post-1')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200)
      .expect({ status: true });
  });

  test('Should not publish the post of invalid url', async () => {
    await request(app)
      .post('/poet/publish/invalid-post')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(422)
      .expect({ status: false });
  });

  test('Should delete the post of given url', async () => {
    await request(app)
      .delete('/poet/deletePost/post-1')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200)
      .expect({ status: true });
  });

  test('Should not delete the post of invalid url', async () => {
    await request(app)
      .delete('/poet/deletePost/invalid-post')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(422)
      .expect({ status: false });
  });
});
