import { NextResponse } from 'next/server';

export async function GET() {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.thepoppypie.com';

    const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/api/sitemap

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/

# Disallow authentication pages
Disallow: /login
Disallow: /reset-password

# Allow specific public pages
Allow: /
Allow: /about-us
Allow: /services
Allow: /our-work
Allow: /blogs
Allow: /careers
Allow: /contact-us

# Crawl-delay (optional)
Crawl-delay: 1`;

    return new NextResponse(robotsTxt, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, s-maxage=86400', // Cache for 24 hours
        },
    });
}