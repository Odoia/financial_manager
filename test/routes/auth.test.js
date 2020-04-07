const request = require('supertest')
const app = require('../../src/app')

test('should be receiver a token at login', () => {
  const email = `${Date.now()}@mail.com`
  return app.services.user.save(
    { name: 'walter', email, passwd: '123456' }
  ).then(() => request(app).post('/auth/signin')
    .send({ email, passwd: '123456' }))
    .then((res) => {
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('token')
    })
})


test('must not authenticate user with wrong password', () => {
  const email = `${Date.now()}@mail.com`
  return app.services.user.save(
    { name: 'walter', email, passwd: '123456' }
  ).then(() => request(app).post('/auth/signin')
    .send({ email, passwd: '654321' }))
    .then((res) => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('User or password invalid')
    })
})

test('must not authenticate user with wrong password', () => {
  return request(app).post('/auth/signin')
    .send({ email: 'error@error.com', passwd: '654321' })
    .then((res) => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('User or password invalid')
    })
})

test('should not access a protected route without a token', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(401)
    })
})
