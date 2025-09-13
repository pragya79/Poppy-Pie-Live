"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
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
    const params = useParams()
    const { slug } = params

    // Fetch blog post by slug
    useEffect(() => {
        const fetchBlogPost = async () => {
            if (!slug) return
            setIsLoading(true)
            try {
                // First try the new slug-specific API endpoint
                let response = await fetch(`/api/posts/slug/${slug}`)

                // If that fails, fall back to fetching all posts and filtering
                if (!response.ok) {
                    response = await fetch('/api/posts?status=published')
                    if (!response.ok) {
                        throw new Error('Failed to fetch blog posts')
                    }
                    const data = await response.json()
                    const posts = data.posts || data || []
                    const foundPost = posts.find(post => post.slug === slug && post.status === "published")
                    if (!foundPost) {
                        throw new Error('Blog post not found or not published')
                    }
                    setPost(foundPost)
                } else {
                    const foundPost = await response.json()
                    setPost(foundPost)
                }
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
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                <h1 className="text-xl sm:text-2xl font-bold text-red-500 mb-4">Error</h1>
                <p className="text-sm sm:text-base mb-4">{error || "Blog post not found"}</p>
                <Button
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto"
                >
                    <Link href="/blogs">
                        ← Back to Blog
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Card className="max-w-4xl mx-auto">
                <div className="relative aspect-video">
                    {post.featuredImage ? (
                        <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover rounded-t-lg"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 rounded-t-lg">
                            <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10" />
                        </div>
                    )}
                </div>
                <CardHeader className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                        <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{post.category}</span>
                    </div>
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 lg:p-8 pt-0">
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
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
                        className="prose prose-sm sm:prose lg:prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{formatDate(post.publishedDate)}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <User className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{post.author}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span>{post.views || 0} views</span>
                    </div>
                </CardContent>
            </Card>
            <div className="max-w-4xl mx-auto mt-4 sm:mt-6 px-4 sm:px-0">
                <Button
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto"
                >
                    <Link href="/blogs">
                        ← Back to Blog
                    </Link>
                </Button>
            </div>
        </div>
    )
}