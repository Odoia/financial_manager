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

test('you should not enter an account without name', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ user_id: user.id })
    .then((result) => {
      expect(result.status).toBe(400)
      expect(result.body.error).toBe('Name is required')
    })
})

test.skip('you should not enter a duplicate account for one user', () =>{
})

test('should list all accounts', () => {
  return app.db('accounts')
    .insert({ name: 'Acc list', user_id: user.id })
    .then(() => request(app).get(MAIN_ROUTE))
    .then((res) => {
      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
    })
})

test.skip('should list only user account', () => {

})

test('should return accounts by id', () => {
  return app.db('accounts')
    .insert({ name: 'Acc by ID', user_id: user.id }, ['id'])
    .then(acc => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`))
    .then((res) => {
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('Acc by ID')
      expect(res.body.user_id).toBe(user.id)
    })
})

test('should update account', () => {
  return app.db('accounts')
    .insert({ name: 'Acc to update', user_id: user.id }, ['id'])
    .then(acc => request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
      .send({ name: 'Acc updated' }))
    .then((res) => {
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('Acc updated')
    })
})

test.skip('you should not enter a update other account', () => {
})

test('should delete account', () => {
  return app.db('accounts')
    .insert({ name: 'Acc to delete', user_id: user.id }, ['id'])
    .then(acc => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`))
    .then((res) => {
      expect(res.status).toBe(204)
    })
})
