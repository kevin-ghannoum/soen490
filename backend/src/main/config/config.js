require('dotenv').config();

console.log("USERS", process.env.DB_USERNAME)
console.log("PASSWORD", process.env.DB_PASSWORD)
console.log("DATABASE", process.env.DB_NAME)


module.exports = {
  "development": {
      "username": "root",
      "password": "",
      "database": "badob_tech",
      "host": "127.0.0.1",
      "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
