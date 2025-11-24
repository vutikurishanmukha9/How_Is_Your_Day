import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/auth';

/**
 * POST /api/auth/logout
 * Logout (client-side token removal)
 */
export async function POST(request: NextRequest) {
    // Since we're using JWT, logout is handled client-side by removing the token
    // This endpoint exists for consistency and future enhancements
    return successResponse({
        message: 'Logged out successfully',
    });
}
