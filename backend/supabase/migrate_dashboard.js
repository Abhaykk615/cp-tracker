const supabase = require('./supabaseClient');

const migrateDashboard = async () => {
  try {
    console.log('Running dashboard tables migration...');

    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create total_questions table
        CREATE TABLE IF NOT EXISTS public.total_questions (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          leetcode_total INTEGER DEFAULT 0,
          leetcode_easy INTEGER DEFAULT 0,
          leetcode_medium INTEGER DEFAULT 0,
          leetcode_hard INTEGER DEFAULT 0,
          codechef_total INTEGER DEFAULT 0,
          codeforces_total INTEGER DEFAULT 0,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create contest_ranking_info table
        CREATE TABLE IF NOT EXISTS public.contest_ranking_info (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          leetcode_recent_contest_rating FLOAT DEFAULT 0,
          leetcode_max_contest_rating FLOAT DEFAULT 0,
          codechef_stars INTEGER DEFAULT 0,
          codechef_recent_contest_rating INTEGER DEFAULT 0,
          codechef_max_contest_rating INTEGER DEFAULT 0,
          codeforces_recent_contest_rating INTEGER DEFAULT 0,
          codeforces_max_contest_rating INTEGER DEFAULT 0,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Add indexes
        CREATE INDEX IF NOT EXISTS total_questions_id_idx ON public.total_questions(id);
        CREATE INDEX IF NOT EXISTS contest_ranking_info_id_idx ON public.contest_ranking_info(id);

        -- Enable RLS
        ALTER TABLE public.total_questions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.contest_ranking_info ENABLE ROW LEVEL SECURITY;

        -- Create policies
        DROP POLICY IF EXISTS "Users can view their own questions" ON public.total_questions;
        CREATE POLICY "Users can view their own questions" ON public.total_questions FOR SELECT USING (auth.uid() = id);
        
        DROP POLICY IF EXISTS "Users can update their own questions" ON public.total_questions;
        CREATE POLICY "Users can update their own questions" ON public.total_questions FOR ALL USING (auth.uid() = id);

        DROP POLICY IF EXISTS "Users can view their own contest info" ON public.contest_ranking_info;
        CREATE POLICY "Users can view their own contest info" ON public.contest_ranking_info FOR SELECT USING (auth.uid() = id);
        
        DROP POLICY IF EXISTS "Users can update their own contest info" ON public.contest_ranking_info;
        CREATE POLICY "Users can update their own contest info" ON public.contest_ranking_info FOR ALL USING (auth.uid() = id);
      `
    });

    if (error) {
      console.error('Migration error:', error.message);
      console.log('If "exec_sql" function is missing, please run the SQL manually in Supabase SQL Editor.');
    } else {
      console.log('✅ Dashboard tables migration successful!');
    }
  } catch (error) {
    console.error('Exception during migration:', error.message);
  }
};

if (require.main === module) {
  migrateDashboard().then(() => process.exit());
}

module.exports = migrateDashboard;
