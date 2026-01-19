/**
 * Run this script to set up the profiles table in Supabase
 * Execute with: node setup-db.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Setting up database tables...');

    // Create profiles table using SQL
    const { data, error } = await supabase.rpc('create_profiles_table', {});

    if (error && !error.message.includes('already exists')) {
      console.log('Attempting to create table via direct schema...');
    }

    // Test if table exists by trying to select
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (testError) {
      console.log('Creating profiles table manually...');
      
      // The table doesn't exist, we need to create it in Supabase dashboard
      console.log(`
⚠️  MANUAL SETUP REQUIRED:

The 'profiles' table needs to be created in your Supabase database.

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Navigate to the SQL Editor
3. Run the following SQL:

${createProfilesTableSQL}

4. Then run this script again to verify.
      `);
      process.exit(1);
    } else {
      console.log('✅ Profiles table exists!');
      console.log('Database setup complete.');
      process.exit(0);
    }
  } catch (error) {
    console.error('Error during setup:', error.message);
    process.exit(1);
  }
}

const createProfilesTableSQL = `
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  codechef_username TEXT,
  codeforces_username TEXT,
  leetcode_username TEXT,
  location TEXT,
  organization TEXT,
  work TEXT,
  bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
`;

console.log('✨ Starting database setup...\n');
setupDatabase();
