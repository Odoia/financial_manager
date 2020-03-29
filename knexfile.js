module.exports = {
  test: {
    client: 'pg',
    version: '9.6',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '',
      database: 'financial_manager',
    },
    migrations: { directory: 'src/migrations' },
  },
};
