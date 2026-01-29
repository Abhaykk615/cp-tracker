import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://usuaxpunqknbismkvgrf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_R91mReXXGl4NTixiVPLkVQ_2YKt1pWY';
const redirectTo = import.meta.env.VITE_REDIRECT_URL || 'https://cp-tracker.vercel.app/profile';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    redirectTo,
  },
});