module.exports = {
  development: {
    username: 'root',
    password: 'password',
    database: 'badob_tech',
    host: 'localhost',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: 'localhost',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
          require: true,
          rejectUnauthorized: false
      }
    },
  },
};
