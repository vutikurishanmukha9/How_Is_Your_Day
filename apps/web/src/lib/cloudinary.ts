import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary
 * @param file - File buffer or base64 string
 * @param folder - Cloudinary folder (default: 'blog-posts')
 * @returns Cloudinary upload result with secure URL
 */
export async function uploadImage(
    file: string | Buffer,
    folder: string = 'blog-posts'
) {
    try {
        const result = await cloudinary.uploader.upload(file as string, {
            folder,
            resource_type: 'image',
            transformation: [
                { width: 1200, height: 630, crop: 'limit' }, // Limit max size
                { quality: 'auto' }, // Auto quality
                { fetch_format: 'auto' }, // Auto format (WebP when supported)
            ],
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image');
    }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - Cloudinary public ID
 */
export async function deleteImage(publicId: string) {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete image');
    }
}

export default cloudinary;
