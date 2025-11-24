import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { generateToken, successResponse, errorResponse } from '@/lib/auth';
import { EMAIL_REGEX } from '@how-is-your-day/shared';
import bcrypt from 'bcryptjs';

/**
 * POST /api/auth/login
 * Admin login
 * Body: { email: string, password: string }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !EMAIL_REGEX.test(email)) {
            return errorResponse('Invalid email address');
        }

        if (!password || password.length < 6) {
            return errorResponse('Password must be at least 6 characters');
        }

        // Find user by email
        const { data: user, error } = await supabaseServer
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return errorResponse('Invalid email or password', 401);
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return errorResponse('Invalid email or password', 401);
        }

        // Check if user is verified
        if (!user.is_verified) {
            return errorResponse('Account not verified', 403);
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            isAdmin: user.is_admin,
        });

        return successResponse({
            token,
            user: {
                id: user.id,
                email: user.email,
                display_name: user.display_name,
                is_admin: user.is_admin,
            },
        });
    } catch (error) {
        console.error('API error:', error);
        return errorResponse('Internal server error', 500);
    }
}
