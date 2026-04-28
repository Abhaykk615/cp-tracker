const supabase = require('./supabase/supabaseClient');
require('dotenv').config();

async function migrate() {
  console.log('Starting migration to add missing columns to profiles table...');
  
  const sql = `
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin TEXT;
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error running migration via RPC:', error.message);
      console.log('Please run the following SQL manually in Supabase SQL Editor:');
      console.log(sql);
    } else {
      console.log('✅ Migration successful! Columns added.');
    }
  } catch (err) {
    console.error('Exception during migration:', err.message);
    console.log('Please run the following SQL manually in Supabase SQL Editor:');
    console.log(sql);
  }
}

migrate();
