import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

/**
 * Client-side Supabase client with anon key
 * Safe to use in browser/client components
 */
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper function to get Supabase client for client components
 */
export function getSupabaseClient() {
    return supabaseClient;
}
