const request = require('supertest')
const jwt = require('jwt-simple')
const app = require('../../src/app')

const email = `${Date.now()}@mail.com`
let user

beforeAll(async () => {
  const res = await app.services.user.save({
    name: 'user account',
    email: `${Date.now()}@mail.com`,
    passwd: '123' 
  })
  user = { ...res[0] }
  user.token = jwt.encode(user, 'secret')
})

test('must list all users', () => {
  return request(app).get('/users')
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
    })
})

test('must insert user successfully', () => {
  return request(app).post('/users')
    .send({ name: 'walter', email, passwd: '1234' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201)
      expect(res.body.name).toBe('walter')
      expect(res.body).not.toHaveProperty('passwd')
    })
})

test('should insert a encrypted password', async () => {
  const res = await request(app).post('/users')
    .send({ name: 'new name', email: `${Date.now()}@mail.com`, passwd: '1234' })
    .set('authorization', `bearer ${user.token}`)
  expect(res.status).toBe(201)

  const { id } = res.body
  const userDb = await app.services.user.findOne({ id })
  expect(userDb.passwd).not.toBeUndefined()
  expect(userDb.passwd).not.toBe('123456')
})

test('should not insert a user without name', () => {
  return request(app).post('/users')
    .send({ email: 'mail@mail.com', passwd: '1234' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Name is require')
    })
})

test('should not insert a user without email', async () => {
  const result = await request(app).post('/users')
    .send({ name: 'walter', passwd: '1234' })
    .set('authorization', `bearer ${user.token}`)
  expect(result.status).toBe(400)
  expect(result.body.error).toBe('Email is require')
})

test('should not insert a user without password', (done) => {
  request(app).post('/users')
  .send({ name: 'walter', email: 'mail@mail.com' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Password is require')
      done()
    })
    .catch(err => done.fail(err))
})

test('should not insert a user without name', () => {
  return request(app).post('/users')
    .send({ email: 'mail@mail.com', passwd: '1234' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Name is require')
    })
})

test('shoud not insert a duplicate email', () => {
  return request(app).post('/users')
    .send({ name: 'walter', email, passwd: '1234' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Duplicate Email')
    })
})
