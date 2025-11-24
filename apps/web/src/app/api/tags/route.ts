import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/auth';

/**
 * GET /api/tags
 * Get all tags with post counts
 */
export async function GET(request: NextRequest) {
    try {
        const { data, error } = await supabaseServer
            .from('tag_counts')
            .select('*')
            .order('count', { ascending: false });

        if (error) {
            console.error('Database error:', error);
            return errorResponse('Failed to fetch tags', 500);
        }

        return successResponse(data || []);
    } catch (error) {
        console.error('API error:', error);
        return errorResponse('Internal server error', 500);
    }
}
