import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Blog from '../../../models/Blog';
import Job from '../../../models/Job';

export async function GET() {
    try {
        await connectToDatabase();

        // Get all published blog posts
        const blogPosts = await Blog.find({ status: 'published' })
            .select('slug updatedAt')
            .lean();

        // Get all published jobs
        const jobs = await Job.find({ status: 'published' })
            .select('slug updatedAt')
            .lean();

        const baseUrl = process.env.NEXTAUTH_URL || 'https://www.thepoppypie.com';
        const currentDate = new Date().toISOString();

        // Static pages
        const staticPages = [
            {
                url: baseUrl,
                lastmod: currentDate,
                changefreq: 'daily',
                priority: '1.0'
            },
            {
                url: `${baseUrl}/about-us`,
                lastmod: currentDate,
                changefreq: 'weekly',
                priority: '0.8'
            },
            {
                url: `${baseUrl}/services`,
                lastmod: currentDate,
                changefreq: 'weekly',
                priority: '0.9'
            },
            {
                url: `${baseUrl}/our-work`,
                lastmod: currentDate,
                changefreq: 'weekly',
                priority: '0.8'
            },
            {
                url: `${baseUrl}/blogs`,
                lastmod: currentDate,
                changefreq: 'daily',
                priority: '0.7'
            },
            {
                url: `${baseUrl}/careers`,
                lastmod: currentDate,
                changefreq: 'weekly',
                priority: '0.7'
            },
            {
                url: `${baseUrl}/contact-us`,
                lastmod: currentDate,
                changefreq: 'monthly',
                priority: '0.6'
            }
        ];

        // Blog post URLs
        const blogUrls = blogPosts.map(post => ({
            url: `${baseUrl}/blogs/${post.slug}`,
            lastmod: post.updatedAt ? new Date(post.updatedAt).toISOString() : currentDate,
            changefreq: 'monthly',
            priority: '0.6'
        }));

        // Job URLs
        const jobUrls = jobs.map(job => ({
            url: `${baseUrl}/careers/${job.slug}`,
            lastmod: job.updatedAt ? new Date(job.updatedAt).toISOString() : currentDate,
            changefreq: 'weekly',
            priority: '0.7'
        }));

        // Combine all URLs
        const allUrls = [...staticPages, ...blogUrls, ...jobUrls];

        // Generate XML sitemap
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ url, lastmod, changefreq, priority }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        return new NextResponse(sitemap, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400', // Cache for 1 hour
            },
        });

    } catch (error) {
        console.error('Sitemap generation error:', error);

        // Return a minimal sitemap with just the homepage if there's an error
        const baseUrl = process.env.NEXTAUTH_URL || 'https://www.thepoppypie.com';
        const currentDate = new Date().toISOString();

        const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

        return new NextResponse(fallbackSitemap, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400', // Shorter cache for fallback
            },
        });
    }
}