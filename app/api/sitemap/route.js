import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
    const publicDir = path.join(process.cwd(), 'public', 'blog')
    const files = fs.existsSync(publicDir) ? fs.readdirSync(publicDir) : []

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${files.map(file => `
                <url>
                    <loc>${NEXTAUTH_URL}/blog/${file}</loc>
                    <lastmod>${new Date().toISOString()}</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.8</priority>
                </url>
            `).join('')}
        </urlset>`

    res.setHeader('Content-Type', 'application/xml')
    res.write(sitemap)
    res.end()
}