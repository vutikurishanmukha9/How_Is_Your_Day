import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { sendSubscriptionConfirmation } from '@/lib/sendgrid';
import { successResponse, errorResponse } from '@/lib/auth';
import { EMAIL_REGEX } from '@how-is-your-day/shared';
import crypto from 'crypto';

/**
 * POST /api/subscribe
 * Subscribe to newsletter
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        // Validate email
        if (!email || !EMAIL_REGEX.test(email)) {
            return errorResponse('Invalid email address');
        }

        // Generate confirmation token
        const confirmToken = crypto.randomBytes(32).toString('hex');

        // Check if already subscribed
        const { data: existing } = await supabaseServer
            .from('subscribers')
            .select('*')
            .eq('email', email)
            .single();

        if (existing) {
            if (existing.confirmed) {
                return errorResponse('Email already subscribed');
            }
            // Resend confirmation
            await sendSubscriptionConfirmation(email, existing.confirm_token);
            return successResponse({
                message: 'Confirmation email resent. Please check your inbox.',
            });
        }

        // Insert new subscriber
        const { error } = await supabaseServer
            .from('subscribers')
            .insert({
                email,
                confirm_token: confirmToken,
                confirmed: false,
            });

        if (error) {
            console.error('Database error:', error);
            return errorResponse('Failed to subscribe', 500);
        }

        // Send confirmation email
        try {
            await sendSubscriptionConfirmation(email, confirmToken);
        } catch (emailError) {
            console.error('Email error:', emailError);
            // Don't fail the request if email fails
        }

        return successResponse({
            message: 'Subscription successful! Please check your email to confirm.',
        });
    } catch (error) {
        console.error('API error:', error);
        return errorResponse('Internal server error', 500);
    }
}
