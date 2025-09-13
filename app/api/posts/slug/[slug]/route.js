import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import Blog from '../../../../../models/Blog';

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

// GET post by slug
export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { slug } = await params;

        const post = await Blog.findOne({ slug }).lean();
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Check if user can view unpublished posts
        const session = await getServerSession(authOptions);
        if (post.status !== 'published' && (!session || !session.user || session.user.role !== 'admin')) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Increment view count for published posts
        if (post.status === 'published') {
            await Blog.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
            post.views = (post.views || 0) + 1;
        }

        const transformedPost = {
            ...post,
            id: post._id.toString(),
            _id: post._id.toString(),
        };

        return NextResponse.json(transformedPost);
    } catch (error) {
        console.error('Failed to fetch post by slug:', error);
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}