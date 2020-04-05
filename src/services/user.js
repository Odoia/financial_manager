const ValidationError = require('../errors/ValidationError')

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select()
  }

  const save = async (user) => {
    if (!user.name) throw new ValidationError('Name is require')
    if (!user.email) throw new ValidationError('Email is require')
    if (!user.passwd) throw new ValidationError('Password is require')
    
    const userDb = await findAll({ email: user.email })
    if (userDb && userDb.length > 0) throw new ValidationError('Duplicate Email')

    return app.db('users').insert(user, '*')
  }

  return { findAll, save }
}
