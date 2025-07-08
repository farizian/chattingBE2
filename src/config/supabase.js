const { createClient } = require('@supabase/supabase-js');
const env = require('../helper/env');

// Create Supabase client
const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;