require('dotenv').config();

const env = {
  port: process.env.PORT,
  host: process.env.host,
  DATABASE_URL: process.env.DATABASE_URL,
  db_username: process.env.db_username,
  db_password: process.env.db_password,
  database: process.env.database,
  pwtoken: process.env.pwtoken,
};

module.exports = env;
