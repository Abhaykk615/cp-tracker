const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Testing connection...');
  const { data, error } = await supabase.from('profiles').select('id').limit(1);
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Success, found', data.length, 'profiles');
  }
}

check();
