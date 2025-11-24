import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/auth';

/**
 * GET /api/subscribe/confirm?token=xxx
 * Confirm email subscription
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return errorResponse('Missing confirmation token');
        }

        // Find subscriber with this token
        const { data: subscriber, error: findError } = await supabaseServer
            .from('subscribers')
            .select('*')
            .eq('confirm_token', token)
            .single();

        if (findError || !subscriber) {
            return errorResponse('Invalid confirmation token', 404);
        }

        if (subscriber.confirmed) {
            return successResponse({
                message: 'Email already confirmed',
            });
        }

        // Update subscriber as confirmed
        const { error: updateError } = await supabaseServer
            .from('subscribers')
            .update({ confirmed: true })
            .eq('id', subscriber.id);

        if (updateError) {
            console.error('Database error:', updateError);
            return errorResponse('Failed to confirm subscription', 500);
        }

        return successResponse({
            message: 'Email confirmed successfully! Thank you for subscribing.',
        });
    } catch (error) {
        console.error('API error:', error);
        return errorResponse('Internal server error', 500);
    }
}
