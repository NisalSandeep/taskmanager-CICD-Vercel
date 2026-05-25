const request = require('supertest');
const app = require('./index');

test('GET /api/tasks returns array', async () => {
  const res = await request(app).get('/api/tasks');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('POST /api/tasks creates a task', async () => {
  const res = await request(app)
    .post('/api/tasks')
    .send({ title: 'Test task' });
  expect(res.statusCode).toBe(201);
  expect(res.body.title).toBe('Test task');
});