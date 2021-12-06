/* eslint-disable no-console */
const Pool = require('pg-pool');
const env = require('../helper/env');

// membuat koneksi ke db mysql
const data = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
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
