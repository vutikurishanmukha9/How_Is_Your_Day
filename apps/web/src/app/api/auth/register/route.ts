import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { requireAdmin, successResponse, errorResponse } from '@/lib/auth';
import { EMAIL_REGEX } from '@how-is-your-day/shared';
import bcrypt from 'bcryptjs';

/**
 * POST /api/auth/register
 * Register a new admin user (protected - admin only)
 * Body: { email: string, password: string, display_name?: string }
 */
export async function POST(request: NextRequest) {
    try {
        // Verify admin access
        try {
            requireAdmin(request);
        } catch (authError) {
            return errorResponse('Unauthorized', 401);
        }

        const body = await request.json();
        const { email, password, display_name } = body;

        // Validate input
        if (!email || !EMAIL_REGEX.test(email)) {
            return errorResponse('Invalid email address');
        }

        if (!password || password.length < 8) {
            return errorResponse('Password must be at least 8 characters');
        }

        // Check if user already exists
        const { data: existing } = await supabaseServer
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            return errorResponse('User already exists');
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create user
        const { data: user, error } = await supabaseServer
            .from('users')
            .insert({
                email,
                password_hash,
                display_name: display_name || null,
                is_admin: true,
                is_verified: true,
            })
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return errorResponse('Failed to create user', 500);
        }

        return successResponse({
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email,
                display_name: user.display_name,
            },
        }, 201);
    } catch (error) {
        console.error('API error:', error);
        return errorResponse('Internal server error', 500);
    }
}
