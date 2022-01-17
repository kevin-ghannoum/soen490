module.exports = {
  development: {
    username: 'root',
    password: 'password',
    database: 'badob_tech',
    host: 'localhost',
    dialect: 'postgres',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: 'localhost',
    dialect: 'postgres',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: 'localhost',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
          require: true,
          rejectUnauthorized: false
      }
    },
  },
};
