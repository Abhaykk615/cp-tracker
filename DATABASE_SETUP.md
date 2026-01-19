# Database Setup Instructions

The application needs the following tables in Supabase:
1. `profiles` - User profile information
2. `contest_ranking_info` - Contest ratings and rankings
3. `total_questions` - Total problems solved on each platform

## Quick Setup (Recommended)

1. **Go to your Supabase Dashboard**: https://app.supabase.com
2. **Select your project**: "CPier" or similar
3. **Go to SQL Editor** (left sidebar)
4. **Create a new query** and paste the SQL below:

```sql
-- Create profiles table
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

-- Create contest ranking info table
CREATE TABLE IF NOT EXISTS public.contest_ranking_info (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  leetcode_recent_contest_rating NUMERIC,
  leetcode_max_contest_rating NUMERIC,
  codechef_recent_contest_rating NUMERIC,
  codechef_max_contest_rating NUMERIC,
  codeforces_recent_contest_rating NUMERIC,
  codeforces_max_contest_rating NUMERIC,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create total questions table
CREATE TABLE IF NOT EXISTS public.total_questions (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  leetcode_easy NUMERIC,
  leetcode_medium NUMERIC,
  leetcode_hard NUMERIC,
  leetcode_total NUMERIC,
  codechef_total NUMERIC,
  codeforces_total NUMERIC,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);
CREATE INDEX IF NOT EXISTS contest_ranking_info_id_idx ON public.contest_ranking_info(id);
CREATE INDEX IF NOT EXISTS total_questions_id_idx ON public.total_questions(id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_ranking_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.total_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for contest_ranking_info table
CREATE POLICY "Users can view their own contest data" 
  ON public.contest_ranking_info FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own contest data" 
  ON public.contest_ranking_info FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own contest data" 
  ON public.contest_ranking_info FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for total_questions table
CREATE POLICY "Users can view their own questions data" 
  ON public.total_questions FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own questions data" 
  ON public.total_questions FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own questions data" 
  ON public.total_questions FOR INSERT WITH CHECK (auth.uid() = id);
```

5. **Click "Run"** button (or Ctrl+Enter)
6. **Wait for success message** ✅
7. **Refresh your application** and try again!

---

**After creating all tables**, restart your application and the errors should be fixed!
