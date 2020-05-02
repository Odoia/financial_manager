const request = require('supertest')
const jwt = require('jwt-simple')
const app = require('../../src/app')

const MAIN_ROUTE = '/v1/accounts'
let user
let user2

beforeEach(async () => {
  const res = await app.services.user.save({
    name: 'user account',
    email: `${Date.now()}@mail.com`,
    passwd: '123' 
  })
  user = { ...res[0] }
  user.token = jwt.encode(user, 'secret')

  const res2 = await app.services.user.save({
    name: 'user2 account2',
    email: `${Date.now()}2@mail.com`,
    passwd: '123' 
  })
  user2 = { ...res2[0] }
})

test('should insert an account successfully', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'acc #1' })
    .set('authorization', `bearer ${user.token}`)
    .then((result) => {
      expect(result.status).toBe(201)
      expect(result.body.name).toBe('acc #1')
    })
})

test('you should not enter an account without name', () => {
  return request(app).post(MAIN_ROUTE)
    .send({})
    .set('authorization', `bearer ${user.token}`)
    .then((result) => {
      expect(result.status).toBe(400)
      expect(result.body.error).toBe('Name is required')
    })
})

test('you should not enter a duplicate account for one user', () =>{
  return app.db('accounts').insert({ name: 'duplicate acc', user_id: user.id })
    .then(() => request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
      .send({ name: 'duplicate acc' }))
    .then((res) => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Duplicated name')
    })
})

test('should list only user account', () => {
  return app.db('accounts').insert([
    {name: 'acc1', user_id: user.id},
    {name: 'acc2', user_id: user2.id}
  ]).then(() => request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(1)
      expect(res.body[0].name).toBe('acc1')
    }))
})

test('should return accounts by id', () => {
  return app.db('accounts')
    .insert({ name: 'Acc by ID', user_id: user.id }, ['id'])
    .then(acc => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`)
    .set('authorization', `bearer ${user.token}`))
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
      .send({ name: 'Acc updated' })
    .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('Acc updated')
    })
})

test('you should not enter a update other account', () => {
  return app.db('accounts')
    .insert({ name: 'Acc user #2', user_id: user2.id }, ['id'])
    .then(acc => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`)
        .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(403)
      expect(res.body.error).toBe('error 403')
    }) 
})

test('should delete account', () => {
  return app.db('accounts')
    .insert({ name: 'Acc to delete', user_id: user.id }, ['id'])
    .then(acc => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`)
    .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(204)
    })
})
