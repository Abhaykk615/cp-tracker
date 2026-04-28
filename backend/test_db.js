const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const tables = ['profiles', 'contest_ranking_info', 'total_questions'];
  
  for (const table of tables) {
    process.stdout.write(`Checking table: ${table}... `);
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(0);
      
      if (error) {
        process.stdout.write(`❌ Error: ${error.message}\n`);
      } else {
        process.stdout.write(`✅ Exists\n`);
      }
    } catch (e) {
      process.stdout.write(`❌ Exception: ${e.message}\n`);
    }
  }
}

checkTables();
