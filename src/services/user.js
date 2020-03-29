module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select()
  }

  const save = async (user) => {
    if (!user.name) return { error: 'Name is require' }
    if (!user.email) return { error: 'Email is require' }
    if (!user.passwd) return { error: 'Password is require' }
    
    const userDb = await findAll({ email: user.email })
    if (userDb && userDb.length > 0) return { error: 'Duplicate Email' }

    return app.db('users').insert(user, '*')
  }

  return { findAll, save }
}
