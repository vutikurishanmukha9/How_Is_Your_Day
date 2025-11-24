import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export interface JWTPayload {
    userId: number;
    email: string;
    isAdmin: boolean;
}

/**
 * Generate a JWT token for authenticated user
 */
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

/**
 * Extract token from Authorization header
 */
export function getTokenFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}

/**
 * Middleware to verify admin access
 */
export function requireAdmin(request: NextRequest): JWTPayload {
    const token = getTokenFromRequest(request);

    if (!token) {
        throw new Error('No authentication token provided');
    }

    const payload = verifyToken(token);

    if (!payload.isAdmin) {
        throw new Error('Admin access required');
    }

    return payload;
}

/**
 * Middleware to verify authenticated user
 */
export function requireAuth(request: NextRequest): JWTPayload {
    const token = getTokenFromRequest(request);

    if (!token) {
        throw new Error('No authentication token provided');
    }

    return verifyToken(token);
}

/**
 * Create an error response
 */
export function errorResponse(message: string, status: number = 400) {
    return NextResponse.json(
        { success: false, error: message },
        { status }
    );
}

/**
 * Create a success response
 */
export function successResponse<T>(data: T, status: number = 200) {
    return NextResponse.json(
        { success: true, data },
        { status }
    );
}
