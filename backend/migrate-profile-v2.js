const supabase = require('./supabase/supabaseClient');
const fs = require('fs');
require('dotenv').config();

async function migrate() {
  let log = 'Starting migration...\n';
  
  const sql = `
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin TEXT;
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      log += `Error running migration: ${error.message}\n`;
    } else {
      log += '✅ Migration successful!\n';
    }
  } catch (err) {
    log += `Exception: ${err.message}\n`;
  }
  
  fs.writeFileSync('migration_result.txt', log);
}

migrate();
