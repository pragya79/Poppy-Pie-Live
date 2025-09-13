import { notFound } from 'next/navigation';
import Image from 'next/image';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Blog';

export async function generateStaticParams() {
  try {
    await dbConnect();
    const posts = await Post.find({ status: 'published' }).select('slug');
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array if DB is not available during build
    return [];
  }
}

export default async function BlogPost({ params }) {
  const { slug } = params;

  try {
    await dbConnect();
    const post = await Post.findOne({ slug, status: 'published' });

    if (!post) {
      notFound();
    }

    // Increment views (only if not in build time)
    if (process.env.NODE_ENV !== 'production' || typeof window !== 'undefined') {
      post.views = (post.views || 0) + 1;
      await post.save();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        {post.featuredImage && (
          <div className="relative w-full h-64 my-4">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        )}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="mt-4 text-sm text-gray-500">
          <p><strong>Category:</strong> {post.category}</p>
          <p><strong>Tags:</strong> {post.tags.join(', ')}</p>
          <p><strong>Author:</strong> {post.author}</p>
          <p><strong>Published:</strong> {new Date(post.publishedDate).toLocaleDateString()}</p>
          <p><strong>Views:</strong> {post.views}</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}