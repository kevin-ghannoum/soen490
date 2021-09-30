require('dotenv').config();

module.exports = {
  "development": {
      "username": "root",
      "password": 'mysqlpw',
      "database": "badob_tech",
      "host": "localhost",
      "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "localhost",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "localhost",
    "dialect": "mysql"
  }
}