import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Blog';

export async function generateStaticParams() {
  await dbConnect();
  const posts = await Post.find({ status: 'published' }).select('slug');
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }) {
  const { slug } = params;

  await dbConnect();
  const post = await Post.findOne({ slug, status: 'published' });

  if (!post) {
    notFound();
  }

  // Increment views
  post.views = (post.views || 0) + 1;
  await post.save();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-64 object-cover my-4"
        />
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
}