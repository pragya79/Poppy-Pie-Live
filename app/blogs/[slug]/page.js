"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Calendar,
    User,
    Tag,
    Image as ImageIcon
} from "lucide-react"

export default function BlogPost() {
    const [post, setPost] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter()
    const { slug } = router.query

    // Fetch blog post by slug
    useEffect(() => {
        const fetchBlogPost = async () => {
            if (!slug) return
            setIsLoading(true)
            try {
                const response = await fetch(`/api/posts?slug=${slug}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch blog post')
                }
                const data = await response.json()
                if (data.length === 0 || data[0].status !== "published") {
                    throw new Error('Blog post not found or not published')
                }
                setPost(data[0])
            } catch (error) {
                setError(error.message)
                console.error('Failed to fetch blog post:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBlogPost()
    }, [slug])

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "Not published"
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-red-500">Error</h1>
                <p>{error || "Blog post not found"}</p>
                <Button
                    variant="link"
                    as="a"
                    href="/blog"
                    className="mt-4"
                >
                    Back to Blog
                </Button>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{post.title} | Our Blog</title>
                <meta name="description" content={post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 160)} />
                <meta name="keywords" content={post.tags ? post.tags.join(", ") : post.category} />
                <meta name="author" content={post.author} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 160)} />
                {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
                <meta property="og:url" content={`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/blog/${post.slug}`} />
                <meta name="robots" content="index, follow" />
            </Head>
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-4xl mx-auto">
                    <div className="relative aspect-video">
                        {post.featuredImage ? (
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                                <ImageIcon className="h-10 w-10" />
                            </div>
                        )}
                    </div>
                    <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Tag className="h-4 w-4" />
                            <span>{post.category}</span>
                        </div>
                        <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags && post.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-6">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(post.publishedDate)}</span>
                            <span className="mx-1">•</span>
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                            <span className="mx-1">•</span>
                            <span>{post.views || 0} views</span>
                        </div>
                    </CardContent>
                </Card>
                <div className="max-w-4xl mx-auto mt-6">
                    <Button
                        variant="link"
                        as="a"
                        href="/blog"
                    >
                        Back to Blog
                    </Button>
                </div>
            </div>
        </>
    )
}