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
