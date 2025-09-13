import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import Blog from '../../../../models/Blog';

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
        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => mongoose);
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

// GET single post by ID
export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const post = await Blog.findById(id).lean();
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Check if user can view unpublished posts
        const session = await getServerSession(authOptions);
        if (post.status !== 'published' && (!session || !session.user || session.user.role !== 'admin')) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const transformedPost = {
            ...post,
            id: post._id.toString(),
            _id: post._id.toString(),
        };

        return NextResponse.json(transformedPost);
    } catch (error) {
        console.error('Failed to fetch post:', error);
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    // Check authentication - only admin can update posts
    const authResult = await checkAuth('admin');
    if (authResult.error) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        await dbConnect();
        const { id } = await params;

        const { title, slug, content, featuredImage, category, tags, status, excerpt } = await request.json();

        // Validation
        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        if (!category) {
            return NextResponse.json({ error: 'Category is required' }, { status: 400 });
        }

        const post = await Blog.findById(id);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Check if slug is being changed and if it already exists
        if (slug && slug !== post.slug) {
            const existingPost = await Blog.findOne({ slug, _id: { $ne: id } });
            if (existingPost) {
                return NextResponse.json({ error: 'Post with this slug already exists' }, { status: 409 });
            }
        }

        // Update post fields
        post.title = title;
        post.slug = slug || post.slug;
        post.content = content;
        post.featuredImage = featuredImage || '';
        post.category = category;
        post.tags = tags || [];
        post.status = status;
        post.excerpt = excerpt || '';

        // Set published date if publishing for the first time
        if (status === 'published' && !post.publishedDate) {
            post.publishedDate = new Date();
        }

        const updatedPost = await post.save();
        const transformedPost = {
            ...updatedPost.toObject(),
            id: updatedPost._id.toString(),
            _id: updatedPost._id.toString(),
        };

        return NextResponse.json(transformedPost, { status: 200 });

    } catch (error) {
        console.error('Failed to update post:', error);
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Post with this slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    // Check authentication - only admin can delete posts
    const authResult = await checkAuth('admin');
    if (authResult.error) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        await dbConnect();
        const { id } = await params;

        const post = await Blog.findByIdAndDelete(id);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return new NextResponse(null, { status: 204 });

    } catch (error) {
        console.error('Failed to delete post:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
