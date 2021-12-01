/* eslint-disable no-console */
const mysql = require('mysql2');
const env = require('../helper/env');

// membuat koneksi ke db mysql
const data = mysql.createConnection({
  host: env.host,
  user: env.db_username,
  password: env.db_password,
  database: env.database,
});
// mengekspor koneksi db
data.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connection success');
  }
});

// export
module.exports = data;
