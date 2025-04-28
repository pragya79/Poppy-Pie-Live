import fs from 'fs'
import path from 'path'

export async function POST(req) {
    const { url, title, content, featuredImage, category, tags, author, publishedDate } = await req.json()

    try {
        // Generate HTML for the blog post page
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="description" content="${title} - A blog post about ${category}">
                <meta name="keywords" content="${tags.join(', ')}">
                <meta name="author" content="${author}">
                <meta property="og:title" content="${title}">
                <meta property="og:description" content="${title} - A blog post about ${category}">
                ${featuredImage ? `<meta property="og:image" content="${featuredImage}">` : ''}
                <meta property="og:type" content="article">
                <meta property="og:url" content="${url}">
                <title>${title} | PoppyPie</title>
            </head>
            <body>
                <h1>${title}</h1>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Published:</strong> ${new Date(publishedDate).toLocaleDateString()}</p>
                <p><strong>Author:</strong> ${author}</p>
                ${featuredImage ? `<img src="${featuredImage}" alt="${title}" />` : ''}
                <div>${content}</div>
                <p><strong>Tags:</strong> ${tags.join(', ')}</p>
            </body>
            </html>
        `

        // Save the HTML file to a public directory
        const slug = url.split('/').pop()
        const publicDir = path.join(process.cwd(), 'public', 'blog')
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true })
        }
        fs.writeFileSync(path.join(publicDir, `${slug}.html`), htmlContent)

        // Optionally, notify Google of the new URL using the Indexing API
        // This requires setup with Google Cloud and an API key
        /*
        const { google } = require('googleapis')
        const auth = new google.auth.JWT({
            keyFile: 'path/to/your-service-account-key.json',
            scopes: ['https://www.googleapis.com/auth/indexing']
        })
        const indexing = google.indexing({ version: 'v3', auth })
        await indexing.urlNotifications.publish({
            requestBody: {
                url,
                type: 'URL_UPDATED'
            }
        })
        */

        return new Response(JSON.stringify({ message: 'Post published successfully', url }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('Error publishing post:', error)
        return new Response(JSON.stringify({ error: 'Failed to publish post' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}