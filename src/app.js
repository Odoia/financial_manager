const app = require('express')()
const consign = require('consign')
const knex = require('knex')
const knexfile = require('../knexfile')

app.db = knex(knexfile.test)

consign({ cwd: 'src', verbose: false })
  .include('./config/middlewares.js')
  .then('./services')
  .then('./routes')
  .then('./config/routes.js')
  .into(app)

app.get('/', (req, res) => {
  res.status(200).send()
})

app.use((err, req, res, next) => {
  const { name, message, stack } = err
  if (name === 'ValidationError') res.status(400).json({ error: message })
  else res.status(500).json({ name, message, stack })
  next(err)
})

module.exports = app
