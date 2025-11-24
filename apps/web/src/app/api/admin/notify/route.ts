import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { requireAdmin, successResponse, errorResponse } from '@/lib/auth';
import { Expo } from 'expo-server-sdk';

// Create Expo SDK client
const expo = new Expo();

/**
 * POST /api/admin/notify
 * Send push notification to mobile users - Admin only
 * Body: { title: string, body: string, data?: object }
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
        const { title, body: messageBody, data } = body;

        if (!title || !messageBody) {
            return errorResponse('Title and body are required');
        }

        // Get all push tokens
        const { data: tokens, error } = await supabaseServer
            .from('push_tokens')
            .select('token');

        if (error) {
            console.error('Database error:', error);
            return errorResponse('Failed to fetch push tokens', 500);
        }

        if (!tokens || tokens.length === 0) {
            return successResponse({
                message: 'No push tokens registered',
                sent: 0,
            });
        }

        // Create messages
        const messages = tokens
            .map((t) => t.token)
            .filter((token) => Expo.isExpoPushToken(token))
            .map((token) => ({
                to: token,
                sound: 'default',
                title,
                body: messageBody,
                data: data || {},
            }));

        if (messages.length === 0) {
            return successResponse({
                message: 'No valid push tokens',
                sent: 0,
            });
        }

        // Send notifications in chunks
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];

        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error('Push notification error:', error);
            }
        }

        return successResponse({
            message: 'Notifications sent',
            sent: messages.length,
            tickets: tickets.length,
        });
    } catch (error) {
        console.error('API error:', error);
        return errorResponse('Internal server error', 500);
    }
}
