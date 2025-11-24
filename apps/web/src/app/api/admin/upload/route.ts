import { NextRequest } from 'next/server';
import { requireAdmin, successResponse, errorResponse } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

/**
 * POST /api/admin/upload
 * Upload an image to Cloudinary - Admin only
 * Body: { image: string (base64 or URL) }
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
        const { image } = body;

        if (!image) {
            return errorResponse('Image data is required');
        }

        // Upload to Cloudinary
        const result = await uploadImage(image);

        return successResponse({
            url: result.url,
            publicId: result.publicId,
            width: result.width,
            height: result.height,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return errorResponse('Failed to upload image', 500);
    }
}
