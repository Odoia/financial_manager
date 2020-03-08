const request = require('supertest')

const app = require('../src/app')

test('must list all users', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0]).toHaveProperty('name', 'john doe')
    })
})

test('must insert user successfully', () => {
  return request(app).post('/users')
    .send({ name: 'walter', email: 'walter@mail.com' })
    .then((res) => {
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('walter')
    })
})
