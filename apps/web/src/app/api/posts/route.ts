import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/auth';
import { PAGINATION } from '@how-is-your-day/shared';

/**
 * GET /api/posts
 * List published posts with pagination and filtering
 * Query params: page, limit, tag, search
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = Math.min(
            parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT)),
            PAGINATION.MAX_LIMIT
        );
        const tag = searchParams.get('tag');
        const search = searchParams.get('search');

        const offset = (page - 1) * limit;

        // Build query
        let query = supabaseServer
            .from('posts')
            .select('*', { count: 'exact' })
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        // Filter by tag if provided
        if (tag) {
            query = query.contains('tags', [tag]);
        }

        // Search in title and content if provided
        if (search) {
            query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
        }

        // Apply pagination
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            console.error('Database error:', error);
            return errorResponse('Failed to fetch posts', 500);
        }

        return successResponse({
            data,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error) {
        console.error('API error:', error);
        return errorResponse('Internal server error', 500);
    }
}
