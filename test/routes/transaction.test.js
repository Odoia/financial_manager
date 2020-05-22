const request = require('supertest')
const jwt = require('jwt-simple')
const app = require('../../src/app.js')

const MAIN_ROUTE = '/v1/transactions'
let user
let user2
let accUser
let accUser2

beforeAll(async () => {
  await app.db('transactions').del()
  await app.db('accounts').del()
  await app.db('users').del()
  const users = await app.db('users').insert([
    { name: 'user 01', email: 'user1@mail.com', passwd: '$2a$10$RFuRRErw1xzW0kBnKBkv3Oo7QtFwZzvEv0rpgvRjvyBAa/uodgfES' },
    { name: 'user 02', email: 'user2@mail.com', passwd: '$2a$10$RFuRRErw1xzW0kBnKBkv3Oo7QtFwZzvEv0rpgvRjvyBAa/uodgfES' },
  ], '*');
  [user, user2] = users
  delete user.passwd
  user.token = jwt.encode(user, 'secret')
  const accs = await app.db('accounts').insert([
    { name: 'acc 01', user_id: user.id },
    { name: 'acc 02', user_id: user2.id },
  ], '*');
  [accUser, accUser2] = accs
})

test('list only user trasaction', () => {
  return app.db('transactions').insert([
    { description: 'd1', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id },
    { description: 'd2', date: new Date(), ammount: 200, type: 'O', acc_id: accUser2.id }
  ]).then(() => request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0].description).toBe('d1')
    }))
})
