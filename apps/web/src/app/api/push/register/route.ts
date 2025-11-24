import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/auth';

/**
 * POST /api/push/register
 * Register a push notification token
 * Body: { token: string, platform: 'ios' | 'android' }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, platform } = body;

        if (!token || !platform) {
            return errorResponse('Token and platform are required');
        }

        if (!['ios', 'android'].includes(platform)) {
            return errorResponse('Invalid platform');
        }

        // Check if token already exists
        const { data: existing } = await supabaseServer
            .from('push_tokens')
            .select('id')
            .eq('token', token)
            .single();

        if (existing) {
            return successResponse({
                message: 'Token already registered',
            });
        }

        // Insert new token
        const { error } = await supabaseServer
            .from('push_tokens')
            .insert({
                token,
                platform,
            });

        if (error) {
            console.error('Database error:', error);
            return errorResponse('Failed to register token', 500);
        }

        return successResponse({
            message: 'Token registered successfully',
        }, 201);
    } catch (error) {
        console.error('API error:', error);
        return errorResponse('Internal server error', 500);
    }
}
