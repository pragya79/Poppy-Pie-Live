import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
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

export async function GET() {
    try {
        await dbConnect();
        const blogPosts = await Blog.find().lean();
        // Convert _id to string for frontend usage
        const transformedPosts = blogPosts.map(post => ({
            ...post,
            id: post._id.toString(),
            _id: post._id.toString()
        }));
        return NextResponse.json(transformedPosts);
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const { title, slug, content, featuredImage, category, tags, status, author } = await request.json();

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        const newPost = new Blog({
            title,
            slug,
            content,
            featuredImage: featuredImage || '',
            category,
            tags: tags || [],
            author: author || 'Admin',
            publishedDate: status === 'published' ? new Date() : null,
            status
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
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}