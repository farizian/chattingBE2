const { createClient } = require('@supabase/supabase-js');
const env = require('../helper/env');

// Validate required environment variables
if (!env.SUPABASE_URL) {
  console.error('❌ SUPABASE_URL is missing from environment variables');
  throw new Error('SUPABASE_URL is required. Please check your .env file.');
}

if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing from environment variables');
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required. Please check your .env file.');
}

console.log('🚀 Initializing Supabase client...');
console.log('📍 URL:', env.SUPABASE_URL);
console.log('🔑 Service Role Key:', env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing');

// Create Supabase client
const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('✅ Supabase client initialized successfully');

module.exports = supabase;