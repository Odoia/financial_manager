const request = require('supertest')

const app = require('../../src/app')

test('must list all users', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
    })
})

test('must insert user successfully', () => {
  const email = `${Date.now()}@mail.com`
  return request(app).post('/users')
    .send({ name: 'walter', email, passwd: '1234' })
    .then((res) => {
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('walter')
    })
})

test('should not insert a user without name', () => {
  return request(app).post('/users')
    .send({ email: 'mail@mail.com', passwd: '1234' })
    .then((res) => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Name is require')
    })
})

test('should not insert a user without email', async () => {
  const result = await request(app).post('/users')
    .send({ name: 'walter', passwd: '1234' })
  expect(result.status).toBe(400)
  expect(result.body.error).toBe('Email is require')
})

test('should not insert a user without password', (done) => {
  request(app).post('/users')
  .send({ name: 'walter', email: 'mail@mail.com' })
    .then((res) => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Password is require')
      done()
    })
    .catch(err => done.fail(err))
})
