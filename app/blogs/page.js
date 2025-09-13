"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Search,
    FileText,
    Calendar,
    User,
    Image as ImageIcon,
    Tag
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"

// Categories
const categories = [
    "Digital Marketing",
    "Branding",
    "Content Marketing",
    "Social Media",
    "Email Marketing",
    "SEO",
    "PPC",
    "Analytics"
]

export default function BlogPage() {
    const [blogPosts, setBlogPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [tagFilter, setTagFilter] = useState("all")
    const [error, setError] = useState(null)
    const [selectedPost, setSelectedPost] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Get unique tags from all posts
    const allTags = useMemo(() => {
        const tags = new Set()
        blogPosts.forEach(post => {
            if (post.tags) {
                post.tags.forEach(tag => tags.add(tag))
            }
        })
        return ["all", ...Array.from(tags).sort()]
    }, [blogPosts])

    // Fetch blog posts from API
    useEffect(() => {
        const fetchBlogPosts = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await fetch('/api/posts?status=published')
                console.log('Response status:', response.status, response.statusText)
                if (!response.ok) {
                    throw new Error(`Failed to fetch blog posts: ${response.status} ${response.statusText}`)
                }
                const data = await response.json()
                console.log('Fetched data:', data)

                // Handle both old and new API response formats
                const posts = data.posts || data || []
                const publishedPosts = posts.filter(post => post.status === "published")
                setBlogPosts(publishedPosts)
                setFilteredPosts(publishedPosts)
            } catch (error) {
                setError(error.message)
                console.error('Failed to fetch blog posts:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBlogPosts()
    }, [])

    // Handle filtering and searching
    useEffect(() => {
        let result = [...blogPosts]

        if (categoryFilter !== "all") {
            result = result.filter(post => post.category === categoryFilter)
        }

        if (tagFilter !== "all") {
            result = result.filter(post =>
                post.tags && post.tags.includes(tagFilter)
            )
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(post =>
                post.title.toLowerCase().includes(term) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(term)) ||
                post.content.toLowerCase().includes(term) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term)))
            )
        }

        setFilteredPosts(result)
    }, [blogPosts, categoryFilter, tagFilter, searchTerm])

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

    return (
        <div className="space-y-6 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {error && (
                <div className="text-red-500 text-center p-4 bg-red-50 rounded-md">
                    <p className="text-sm sm:text-base">{error}</p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setError(null)
                            fetchBlogPosts()
                        }}
                        className="mt-2"
                    >
                        Retry
                    </Button>
                </div>
            )}
            <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Our Blog</h1>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-2xl mx-auto">Explore our latest insights and tips</p>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="pt-4 sm:pt-6">
                    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-4 sm:justify-between sm:items-center">
                        <div className="flex-1 relative w-full sm:max-w-md">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search blog posts..."
                                className="pl-9 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full sm:w-[160px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={tagFilter} onValueChange={setTagFilter}>
                                <SelectTrigger className="w-full sm:w-[160px]">
                                    <SelectValue placeholder="Tag" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Tags</SelectItem>
                                    {allTags.filter(tag => tag !== "all").map(tag => (
                                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Blog Posts */}
            <div>
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-12 sm:py-16 text-gray-500">
                        <FileText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm sm:text-base mb-4">No blog posts found</p>
                        {(searchTerm || categoryFilter !== "all" || tagFilter !== "all") && (
                            <Button
                                variant="link"
                                onClick={() => {
                                    setSearchTerm("")
                                    setCategoryFilter("all")
                                    setTagFilter("all")
                                }}
                                className="text-sm sm:text-base"
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                        {filteredPosts.map((post) => (
                            <Card key={post._id} className="overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                                <div className="relative aspect-video">
                                    {post.featuredImage ? (
                                        <Image
                                            src={post.featuredImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                                            <ImageIcon className="h-10 w-10" />
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="pb-2 sm:pb-0 p-4 sm:p-6">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2">
                                        <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                                        <span className="truncate">{post.category}</span>
                                    </div>
                                    <CardTitle className="text-sm sm:text-base font-semibold line-clamp-2 h-10 sm:h-12 leading-tight">
                                        <a href={`/blogs/${post.slug}`} className="hover:underline transition-colors">
                                            {post.title}
                                        </a>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 p-4 sm:p-6 pt-0">
                                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 h-[3.5rem] sm:h-[4.5rem] mb-3">
                                        {post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 120) + '...'}
                                    </p>
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2 mb-3">
                                            {post.tags.slice(0, 3).map(tag => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors"
                                                    onClick={() => setTagFilter(tag)}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 mt-3 pt-3 border-t">
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="truncate">{formatDate(post.publishedDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <User className="h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="truncate">{post.author}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center border-t pt-3 mt-auto p-4 sm:p-6">
                                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                                        <span className="truncate">{post.views || 0} views</span>
                                    </div>

                                    {/* Dialog Trigger */}
                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="text-xs sm:text-sm p-0 h-auto"
                                                onClick={() => {
                                                    setSelectedPost(post)
                                                    setIsDialogOpen(true)
                                                }}
                                            >
                                                Read More
                                            </Button>
                                        </DialogTrigger>
                                        {selectedPost && (
                                            <DialogContent className="max-h-[85vh] overflow-y-auto max-w-xs sm:max-w-lg lg:max-w-3xl mx-4 sm:mx-auto">
                                                <DialogHeader className="space-y-2 sm:space-y-3">
                                                    <DialogTitle className="text-lg sm:text-xl lg:text-2xl leading-tight">{selectedPost.title}</DialogTitle>
                                                    <DialogDescription className="text-sm sm:text-base">
                                                        {formatDate(selectedPost.publishedDate)} by {selectedPost.author}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                {selectedPost.featuredImage && (
                                                    <div className="relative w-full h-32 sm:h-48 lg:h-64 mb-4">
                                                        <Image
                                                            src={selectedPost.featuredImage}
                                                            alt={selectedPost.title}
                                                            fill
                                                            className="object-cover rounded-md"
                                                            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 700px"
                                                        />
                                                    </div>
                                                )}
                                                <div className="mt-4 text-xs sm:text-sm lg:text-base text-gray-700 prose prose-xs sm:prose-sm lg:prose max-w-none">
                                                    <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                                                </div>
                                                {selectedPost.tags && selectedPost.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-4">
                                                        {selectedPost.tags.map(tag => (
                                                            <span
                                                                key={tag}
                                                                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <DialogFooter className="mt-4 flex-col sm:flex-row gap-2 sm:gap-0">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full sm:w-auto order-2 sm:order-1"
                                                        onClick={() => setIsDialogOpen(false)}
                                                    >
                                                        Close
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        className="w-full sm:w-auto order-1 sm:order-2"
                                                        onClick={() => setIsDialogOpen(false)}
                                                    >
                                                        <a href={`/blogs/${selectedPost.slug}`} target="_blank" rel="noopener noreferrer">
                                                            Open Full Page
                                                        </a>
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        )}
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}