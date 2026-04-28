const supabase = require('./supabase/supabaseClient');
require('dotenv').config();

async function checkColumns() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Error fetching profile:', error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log('Columns in profiles table:', Object.keys(data[0]));
  } else {
    console.log('Profiles table is empty, cannot determine columns this way.');
    // Try to get one profile by a known ID if possible, or just list all
    const { data: allData, error: allErr } = await supabase.from('profiles').select('*').limit(10);
    if (allData && allData.length > 0) {
        console.log('Columns in profiles table:', Object.keys(allData[0]));
    } else {
        console.log('No data in profiles table.');
    }
  }
}

checkColumns();
