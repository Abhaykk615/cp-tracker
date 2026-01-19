const supabase = require('./supabaseClient');

const initializeDatabase = async () => {
  try {
    console.log('Initializing database tables...');

    // Create profiles table if it doesn't exist
    const { data: checkTable, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .limit(0);

    if (checkError && checkError.message.includes('not found')) {
      console.log('Creating profiles table...');
      
      // Create via raw SQL
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
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
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);
        `
      });

      if (createError) {
        console.error('Error creating tables:', createError);
      } else {
        console.log('Database tables initialized successfully');
      }
    } else if (!checkError) {
      console.log('Profiles table already exists');
    }

  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
};

module.exports = initializeDatabase;
