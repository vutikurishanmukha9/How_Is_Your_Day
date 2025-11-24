import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { requireAdmin, successResponse, errorResponse } from '@/lib/auth';
import { slugify, generateUniqueSlug } from '@how-is-your-day/shared';

/**
 * PUT /api/admin/posts/[id]
 * Update a post - Admin only
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Verify admin access
        try {
            requireAdmin(request);
        } catch (authError) {
            return errorResponse('Unauthorized', 401);
        }

        const { id } = params;
        const postId = parseInt(id);

        if (isNaN(postId)) {
            return errorResponse('Invalid post ID');
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

        // Get existing post
        const { data: existingPost, error: fetchError } = await supabaseServer
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (fetchError || !existingPost) {
            return errorResponse('Post not found', 404);
        }

        // Prepare update data
        const updateData: any = {};

        if (title !== undefined) updateData.title = title;
        if (excerpt !== undefined) updateData.excerpt = excerpt;
        if (content !== undefined) updateData.content = content;
        if (featured_image !== undefined) updateData.featured_image = featured_image;
        if (tags !== undefined) updateData.tags = tags;
        if (status !== undefined) {
            if (!['draft', 'published'].includes(status)) {
                return errorResponse('Invalid status');
            }
            updateData.status = status;

            // Set published_at when publishing for the first time
            if (status === 'published' && !existingPost.published_at) {
                updateData.published_at = new Date().toISOString();
            }
        }
        if (published_at !== undefined) updateData.published_at = published_at;

        // Handle slug update
        if (providedSlug !== undefined) {
            let newSlug = slugify(providedSlug);

            // Check if slug is changing and ensure uniqueness
            if (newSlug !== existingPost.slug) {
                const { data: existingSlugs } = await supabaseServer
                    .from('posts')
                    .select('slug')
                    .neq('id', postId);

                if (existingSlugs) {
                    const slugList = existingSlugs.map((p) => p.slug);
                    newSlug = generateUniqueSlug(newSlug, slugList);
                }
            }

            updateData.slug = newSlug;
        }

        // Update post
        const { data: post, error } = await supabaseServer
            .from('posts')
            .update(updateData)
            .eq('id', postId)
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return errorResponse('Failed to update post', 500);
        }

        return successResponse(post);
    } catch (error) {
        console.error('API error:', error);
        return errorResponse('Internal server error', 500);
    }
}

/**
 * DELETE /api/admin/posts/[id]
 * Delete a post - Admin only
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Verify admin access
        try {
            requireAdmin(request);
        } catch (authError) {
            return errorResponse('Unauthorized', 401);
        }

        const { id } = params;
        const postId = parseInt(id);

        if (isNaN(postId)) {
            return errorResponse('Invalid post ID');
        }

        const { error } = await supabaseServer
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) {
            console.error('Database error:', error);
            return errorResponse('Failed to delete post', 500);
        }

        return successResponse({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('API error:', error);
        return errorResponse('Internal server error', 500);
    }
}
