import { NextResponse } from 'next/server';
let blogPosts = require('../route').blogPosts;

export async function PUT(request, { params }) {
    const { id } = params;
    const { title, slug, excerpt, content, featuredImage, category, tags, status } = await request.json();

    if (!title || !content) {
        return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const postIndex = blogPosts.findIndex(post => post.id === id);
    if (postIndex === -1) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const updatedPost = {
        ...blogPosts[postIndex],
        title,
        slug,
        excerpt,
        content,
        featuredImage: featuredImage || '',
        category,
        tags: tags || [],
        status,
        publishedDate: status === 'published' && !blogPosts[postIndex].publishedDate
            ? new Date().toISOString()
            : blogPosts[postIndex].publishedDate
    };

    blogPosts[postIndex] = updatedPost;
    return NextResponse.json(updatedPost, { status: 200 });
}

export async function DELETE(request, { params }) {
    const { id } = params;
    const postIndex = blogPosts.findIndex(post => post.id === id);
    if (postIndex === -1) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    blogPosts.splice(postIndex, 1);
    return new NextResponse(null, { status: 204 });
}