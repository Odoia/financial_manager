module.exports = (app) => {
  const findAll = () => {
    return app.db('users').select()
  }

  const save = (user) => {
    if(!user.name) return { error: 'Name is require' }
    if(!user.email) return { error: 'Email is require' }
    if(!user.passwd) return { error: 'Password is require' }

    return app.db('users').insert(user, '*')
  }

  return { findAll, save }
}
