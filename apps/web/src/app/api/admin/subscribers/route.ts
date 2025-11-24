import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { requireAdmin, successResponse, errorResponse } from '@/lib/auth';

/**
 * GET /api/admin/subscribers
 * List all subscribers - Admin only
 * Query params: confirmed (true/false)
 */
export async function GET(request: NextRequest) {
    try {
        // Verify admin access
        try {
            requireAdmin(request);
        } catch (authError) {
            return errorResponse('Unauthorized', 401);
        }

        const { searchParams } = new URL(request.url);
        const confirmedParam = searchParams.get('confirmed');

        let query = supabaseServer
            .from('subscribers')
            .select('*')
            .order('subscribed_at', { ascending: false });

        // Filter by confirmed status if provided
        if (confirmedParam !== null) {
            const confirmed = confirmedParam === 'true';
            query = query.eq('confirmed', confirmed);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Database error:', error);
            return errorResponse('Failed to fetch subscribers', 500);
        }

        return successResponse(data || []);
    } catch (error) {
        console.error('API error:', error);
        return errorResponse('Internal server error', 500);
    }
}
