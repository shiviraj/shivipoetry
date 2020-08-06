const request = require('supertest');
const { app } = require('../src/router');
const { Author } = require('../src/models/author');

const { authorOne, setupDatabase, cleanupDatabase } = require('./fixtures/db');

describe('Should give static page', () => {
  test('Should serve static page from poet url', async () => {
    await request(app).get('/poet/login.html').expect(200);
  });
  test('Should not serve static page from invalid poet url', async () => {
    await request(app).get('/poet/log.html').expect(302);
  });
});

describe('Poet signup and login', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('Should give result true if username is available', async () => {
    await request(app)
      .post('/poet/username/available')
      .send({ username: 's' })
      .expect(200)
      .expect({ isAvailable: true });
  });

  test('Should give result false if username is available', async () => {
    await request(app)
      .post('/poet/username/available')
      .send({ username: 'Shivi' })
      .expect(200)
      .expect({ isAvailable: false });
  });

  test('Should register new poet', async () => {
    const response = await request(app)
      .post('/poet/register')
      .send({
        username: 'Shivira',
        name: 'Shivam',
        password: 'what789!!',
        email: 'shi@example.com',
      })
      .expect(201);
    const author = Author.findById(response.body._id);
    expect(author).not.toBeNull();
    expect(response.body).toMatchObject({
      name: 'Shivam',
      email: 'shi@example.com',
      username: 'Shivira',
    });
    expect(author.password).not.toBe('what789!!');
  });

  test('Should not register new poet if username is already exists', async () => {
    await request(app)
      .post('/poet/register')
      .send({
        username: 'Shivi',
        name: 'Shivam',
        password: 'what789!!',
        email: 'shi@example.com',
      })
      .expect(400);
  });

  test('Should successfully login user if credentials are right', async () => {
    const res = await request(app)
      .post('/poet/login')
      .send({ username: 'Shivi', password: 'Shivi@123' })
      .expect(200);
    const author = await Author.findById(res.body._id);
    expect(author).toBeNull();
  });

  test('Should not login user if credentials are invalid', async () => {
    const response = await request(app)
      .post('/poet/login')
      .send({ username: 'Shivi', password: 'Shivi@' })
      .expect(400);
  });

  test('Should not login if user not exits', async () => {
    await request(app)
      .post('/poet/login')
      .send({ username: 'userNotExists', password: 'Shivi@' })
      .expect(400);
  });

  test('Should author logout from account', async () => {
    await request(app)
      .get('/poet/logout')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(302)
      .expect('Location', '/poet/login.html');
  });
});

describe('Need authentication', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('Should serve static page from poet url', async () => {
    await request(app)
      .get('/poet/dashboard')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
  });

  test('Should serve static page from poet url of addPost', async () => {
    await request(app)
      .get('/poet/addPost')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(200);
  });

  test('Should not serve static page from invalid poet url', async () => {
    await request(app)
      .get('/poet/log')
      .set('Cookie', `token=token ${authorOne.tokens[0].token}`)
      .expect(404);
  });

  test('Should redirect to login page if poet not authenticate', async () => {
    const res = await request(app).get('/poet/dashboard').expect(302);
    expect(res.headers.location).toBe('/poet/login.html');
  });

  test('Should not serve static page if token is invalid', async () => {
    const res = await request(app)
      .get('/poet/dashboard')
      .set('Cookie', `token=token something`)
      .expect(302);
    expect(res.headers.location).toBe('/poet/login.html');
  });
});
