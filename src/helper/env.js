require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  SUPABASE_URL: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  pwtoken: process.env.pwtoken,
  DATABASE_URL: process.env.DATABASE_URL,
};

// Validate critical environment variables
const requiredVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'pwtoken'];
const missingVars = requiredVars.filter(varName => !env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  console.error('Please ensure your .env file contains all required Supabase configuration values.');
  console.error('You may need to click "Connect to Supabase" in the top right to set up your Supabase connection.');
} else {
  console.log('✅ All required environment variables are set');
  console.log('🔗 Supabase URL:', env.SUPABASE_URL ? 'Set' : 'Missing');
  console.log('🔑 Service Role Key:', env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing');
  console.log('🔐 JWT Token:', env.pwtoken ? 'Set' : 'Missing');
}

module.exports = env;