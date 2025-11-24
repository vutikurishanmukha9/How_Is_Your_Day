import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
}

/**
 * Server-side Supabase client with service role key
 * Use this for admin operations and server-side queries
 * DO NOT expose this to the client
 */
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

/**
 * Helper function to get Supabase client for server components
 */
export function getSupabaseServer() {
    return supabaseServer;
}
