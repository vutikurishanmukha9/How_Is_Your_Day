import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { requireAdmin, successResponse, errorResponse } from '@/lib/auth';
import { slugify, generateUniqueSlug } from '@how-is-your-day/shared';
import { PAGINATION } from '@how-is-your-day/shared';

/**
 * GET /api/admin/posts
 * List all posts (any status) - Admin only
 * Query params: page, limit, status, search
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
        const page = parseInt(searchParams.get('page') || '1');
        const limit = Math.min(
            parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT)),
            PAGINATION.MAX_LIMIT
        );
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const offset = (page - 1) * limit;

        // Build query
        let query = supabaseServer
            .from('posts_with_author')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        // Filter by status if provided
        if (status && (status === 'draft' || status === 'published')) {
            query = query.eq('status', status);
        }

        // Search if provided
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

/**
 * POST /api/admin/posts
 * Create a new post - Admin only
 * Body: { title, slug?, excerpt?, content, featured_image?, tags?, status, published_at? }
 */
export async function POST(request: NextRequest) {
    try {
        // Verify admin access
        let adminUser;
        try {
            adminUser = requireAdmin(request);
        } catch (authError) {
            return errorResponse('Unauthorized', 401);
        }

        const body = await request.json();
        const {
            title,
            slug: providedSlug,
            excerpt,
            content,
            featured_image,
            tags,
            status,
            published_at,
        } = body;

        // Validate required fields
        if (!title || !content) {
            return errorResponse('Title and content are required');
        }

        if (!status || !['draft', 'published'].includes(status)) {
            return errorResponse('Invalid status');
        }

        // Generate slug
        let slug = providedSlug ? slugify(providedSlug) : slugify(title);

        // Check if slug exists and generate unique one if needed
        const { data: existingSlugs } = await supabaseServer
            .from('posts')
            .select('slug');

        if (existingSlugs) {
            const slugList = existingSlugs.map((p) => p.slug);
            slug = generateUniqueSlug(slug, slugList);
        }

        // Create post
        const { data: post, error } = await supabaseServer
            .from('posts')
            .insert({
                title,
                slug,
                excerpt: excerpt || null,
                content,
                author_id: adminUser.userId,
                featured_image: featured_image || null,
                tags: tags || null,
                status,
                published_at:
                    status === 'published' && !published_at ? new Date().toISOString() : published_at,
            })
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return errorResponse('Failed to create post', 500);
        }

        return successResponse(post, 201);
    } catch (error) {
        console.error('API error:', error);
        return errorResponse('Internal server error', 500);
    }
}
