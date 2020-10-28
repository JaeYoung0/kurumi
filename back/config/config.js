const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "kurumi",
    host: "127.0.0.1",
    port: "3306",
    dialect: "mysql",
    timezone: '+09:00'
  },
  test: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "kurumi",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: '+09:00'
  },
  production: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "kurumi",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: '+09:00'
  },
};
