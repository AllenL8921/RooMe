import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL or Anon Key is not defined in environment variables');
}
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false, }, });
