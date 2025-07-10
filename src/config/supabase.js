const { createClient } = require('@supabase/supabase-js');
const env = require('../helper/env');

// Validate required environment variables
if (!env.SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL is required. Please check your .env file.');
}

if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required. Please check your .env file.');
}

// Create Supabase client
const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;