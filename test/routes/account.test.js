const request = require('supertest')
const app = require('../../src/app')

const MAIN_ROUTE = '/accounts'
let user

beforeAll(async () => {
  const res = await app.services.user.save({
    name: 'user account',
    email: `${Date.now()}@mail.com`,
    passwd: '123' 
  })
  user = { ...res[0] }
})

test('should insert an account successfully', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'acc #1', user_id: user.id })
    .then((result) => {
      expect(result.status).toBe(201)
      expect(result.body.name).toBe('acc #1')
    })
})
