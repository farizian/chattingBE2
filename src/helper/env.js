require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  pwtoken: process.env.pwtoken,
};

// Validate critical environment variables
const requiredVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missingVars = requiredVars.filter(varName => !env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  console.error('Please ensure your .env file contains all required Supabase configuration values.');
  console.error('You may need to click "Connect to Supabase" in the top right to set up your Supabase connection.');
}

module.exports = env;