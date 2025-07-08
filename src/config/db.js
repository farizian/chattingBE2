/* eslint-disable no-console */
// Legacy database configuration - now using Supabase
// This file is kept for reference but no longer used

const Pool = require('pg-pool');
const env = require('../helper/env');

// Note: This configuration is deprecated
// The application now uses Supabase client instead
const data = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// This connection is no longer used
console.log('Legacy DB config - now using Supabase');

module.exports = data;