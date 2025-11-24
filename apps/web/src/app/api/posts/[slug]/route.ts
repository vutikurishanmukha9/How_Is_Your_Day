import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/auth';

/**
 * GET /api/posts/[slug]
 * Get a single published post by slug
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;

        const { data, error } = await supabaseServer
            .from('posts_with_author')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (error || !data) {
            return errorResponse('Post not found', 404);
        }

        return successResponse(data);
    } catch (error) {
        console.error('API error:', error);
        return errorResponse('Internal server error', 500);
    }
}
