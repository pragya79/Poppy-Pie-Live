import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
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

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const { title, slug, excerpt, content, featuredImage, category, tags, status } = await request.json();

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        const post = await Blog.findById(id);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        post.title = title;
        post.slug = slug;
        post.excerpt = excerpt;
        post.content = content;
        post.featuredImage = featuredImage || '';
        post.category = category;
        post.tags = tags || [];
        post.status = status;
        post.publishedDate = status === 'published' && !post.publishedDate ? new Date() : post.publishedDate;

        const updatedPost = await post.save();
        const transformedPost = {
            ...updatedPost.toObject(),
            id: updatedPost._id.toString(),
            _id: updatedPost._id.toString(),
        };

        return NextResponse.json(transformedPost, { status: 200 });

    } catch (error) {
        console.error('Failed to update post:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { id } =await params; 

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
