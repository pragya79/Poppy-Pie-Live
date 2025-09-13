import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from 'next-auth/middleware';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Utility function to validate file type
const isValidImageType = (mimetype) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    return allowedTypes.includes(mimetype);
};

// Utility function to validate file size (max 10MB)
const isValidFileSize = (size) => {
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    return size <= maxSize;
};

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const folder = formData.get('folder') || 'general'; // Default folder
        const resize = formData.get('resize'); // Optional resize parameter

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!isValidImageType(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF files are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size
        if (!isValidFileSize(file.size)) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 10MB.' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadOptions = {
            folder: `poppy-pie/${folder}`,
            public_id: `${folder}_${Date.now()}`,
            overwrite: true,
            resource_type: 'image',
            quality: 'auto:best',
            fetch_format: 'auto',
        };

        // Add transformation if resize is requested
        if (resize) {
            const [width, height] = resize.split('x').map(Number);
            if (width && height) {
                uploadOptions.transformation = [
                    { width, height, crop: 'fill', quality: 'auto:best' }
                ];
            }
        }

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(buffer);
        });

        // Return success response with image details
        return NextResponse.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                size: result.bytes,
                folder: folder,
                uploadedAt: new Date().toISOString(),
            }
        });

    } catch (error) {
        console.error('Image upload error:', error);

        return NextResponse.json(
            {
                error: 'Failed to upload image',
                message: error.message || 'Unknown error occurred',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

// Handle image deletion
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const publicId = searchParams.get('publicId');

        if (!publicId) {
            return NextResponse.json(
                { error: 'Public ID is required for deletion' },
                { status: 400 }
            );
        }

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            return NextResponse.json({
                success: true,
                message: 'Image deleted successfully',
                publicId
            });
        } else {
            return NextResponse.json(
                { error: 'Failed to delete image or image not found' },
                { status: 404 }
            );
        }

    } catch (error) {
        console.error('Image deletion error:', error);

        return NextResponse.json(
            {
                error: 'Failed to delete image',
                message: error.message || 'Unknown error occurred'
            },
            { status: 500 }
        );
    }
}

// Get image info
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const publicId = searchParams.get('publicId');
        const folder = searchParams.get('folder');

        if (publicId) {
            // Get specific image info
            const result = await cloudinary.api.resource(publicId);

            return NextResponse.json({
                success: true,
                data: {
                    url: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                    size: result.bytes,
                    createdAt: result.created_at,
                }
            });

        } else if (folder) {
            // List images in folder
            const result = await cloudinary.api.resources({
                type: 'upload',
                prefix: `poppy-pie/${folder}`,
                max_results: 50,
                resource_type: 'image'
            });

            const images = result.resources.map(resource => ({
                url: resource.secure_url,
                publicId: resource.public_id,
                width: resource.width,
                height: resource.height,
                format: resource.format,
                size: resource.bytes,
                createdAt: resource.created_at,
            }));

            return NextResponse.json({
                success: true,
                data: images,
                total: result.resources.length
            });

        } else {
            return NextResponse.json({
                message: 'Image upload API is ready. Use POST to upload, GET with publicId or folder to retrieve.',
                endpoints: {
                    upload: 'POST /api/upload/image',
                    delete: 'DELETE /api/upload/image?publicId=<public_id>',
                    getImage: 'GET /api/upload/image?publicId=<public_id>',
                    listImages: 'GET /api/upload/image?folder=<folder_name>'
                }
            });
        }

    } catch (error) {
        console.error('Image retrieval error:', error);

        return NextResponse.json(
            {
                error: 'Failed to retrieve image info',
                message: error.message || 'Unknown error occurred'
            },
            { status: 500 }
        );
    }
}