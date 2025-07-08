require('dotenv').config();

const env = {
  port: process.env.PORT,
  SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  pwtoken: process.env.pwtoken,
};

module.exports = env;
