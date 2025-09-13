import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import Blog from '../../../models/Blog';

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

// Helper function to check authentication
async function checkAuth(requiredRole = null) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return { error: 'Authentication required', status: 401 };
    }

    if (requiredRole && session.user.role !== requiredRole) {
        return { error: 'Insufficient permissions', status: 403 };
    }

    return { user: session.user };
}

export async function GET(request) {
    try {
        await dbConnect();

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit')) || 50;
        const page = parseInt(searchParams.get('page')) || 1;
        const skip = (page - 1) * limit;

        // Build filter
        let filter = {};
        if (status) {
            filter.status = status;
        }

        // For public access, only show published posts
        const session = await getServerSession(authOptions);
        if (!session || !session.user || session.user.role !== 'admin') {
            filter.status = 'published';
        }

        const blogPosts = await Blog.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean();

        // Get total count for pagination
        const total = await Blog.countDocuments(filter);

        // Transform posts for frontend usage
        const transformedPosts = blogPosts.map(post => ({
            ...post,
            id: post._id.toString(),
            _id: post._id.toString()
        }));

        return NextResponse.json({
            posts: transformedPosts,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
    }
}

export async function POST(request) {
    // Check authentication - only admin can create posts
    const authResult = await checkAuth('admin');
    if (authResult.error) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        await dbConnect();
        const { title, slug, content, featuredImage, category, tags, status, author, excerpt } = await request.json();

        // Validation
        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        if (!category) {
            return NextResponse.json({ error: 'Category is required' }, { status: 400 });
        }

        // Generate slug if not provided
        let finalSlug = slug;
        if (!finalSlug) {
            finalSlug = title.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .trim();
        }

        // Check if slug already exists
        const existingPost = await Blog.findOne({ slug: finalSlug });
        if (existingPost) {
            finalSlug = `${finalSlug}-${Date.now()}`;
        }

        const newPost = new Blog({
            title,
            slug: finalSlug,
            content,
            featuredImage: featuredImage || '',
            category,
            tags: tags || [],
            author: author || authResult.user.name || 'Admin',
            excerpt: excerpt || '',
            publishedDate: status === 'published' ? new Date() : null,
            status: status || 'draft'
        });

        const savedPost = await newPost.save();
        const transformedPost = {
            ...savedPost.toObject(),
            id: savedPost._id.toString(),
            _id: savedPost._id.toString()
        };

        return NextResponse.json(transformedPost, { status: 201 });
    } catch (error) {
        console.error('Failed to create post:', error);
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Post with this slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}