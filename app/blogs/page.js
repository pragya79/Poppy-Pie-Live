"use client"

import { useState, useEffect, useMemo } from "react"
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
                const response = await fetch('/api/posts')
                console.log('Response status:', response.status, response.statusText)
                if (!response.ok) {
                    throw new Error(`Failed to fetch blog posts: ${response.status} ${response.statusText}`)
                }
                const data = await response.json()
                console.log('Fetched data:', data)
                const publishedPosts = data.filter(post => post.status === "published")
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
        <div className="space-y-6 container mx-auto px-4 py-8">
            {error && (
                <div className="text-red-500 text-center p-4 bg-red-50 rounded-md">
                    <p>{error}</p>
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
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Our Blog</h1>
                <p className="text-muted-foreground mt-2">Explore our latest insights and tips</p>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search blog posts..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[140px]">
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
                                <SelectTrigger className="w-[140px]">
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
                    <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No blog posts found</p>
                        {(searchTerm || categoryFilter !== "all" || tagFilter !== "all") && (
                            <Button
                                variant="link"
                                onClick={() => {
                                    setSearchTerm("")
                                    setCategoryFilter("all")
                                    setTagFilter("all")
                                }}
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <Card key={post._id} className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg">
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
                                <CardHeader className="pb-0">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <Tag className="h-4 w-4" />
                                        <span>{post.category}</span>
                                    </div>
                                    <CardTitle className="text-base font-semibold line-clamp-2 h-12">
                                        <a href={`/blog/${post.slug}`} className="hover:underline">
                                            {post.title}
                                        </a>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-gray-600 line-clamp-3 h-[4.5rem]">
                                        {post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...'}
                                    </p>
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {post.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer"
                                                    onClick={() => setTagFilter(tag)}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(post.publishedDate)}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t pt-4 mt-auto">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <User className="h-4 w-4" />
                                        <span>{post.author}</span>
                                        <span className="mx-1">•</span>
                                        <span>{post.views || 0} views</span>
                                    </div>

                                    {/* Dialog Trigger */}
                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="link"
                                                onClick={() => {
                                                    setSelectedPost(post)
                                                    setIsDialogOpen(true)
                                                }}
                                            >
                                                Read More
                                            </Button>
                                        </DialogTrigger>
                                        {selectedPost && (
                                            <DialogContent className="max-h-[85vh] overflow-y-auto max-w-3xl">
                                                <DialogHeader>
                                                    <DialogTitle>{selectedPost.title}</DialogTitle>
                                                    <DialogDescription>
                                                        {formatDate(selectedPost.publishedDate)} by {selectedPost.author}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                {selectedPost.featuredImage && (
                                                    <img
                                                        src={selectedPost.featuredImage}
                                                        alt={selectedPost.title}
                                                        className="w-full h-48 object-cover rounded-md mb-4"
                                                    />
                                                )}
                                                <div className="mt-4 text-sm text-gray-700 prose prose-sm max-w-none">
                                                    <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                                                </div>
                                                {selectedPost.tags && selectedPost.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-4">
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
                                                <DialogFooter className="mt-4">
                                                    <Button
                                                        variant="link"
                                                        onClick={() => setIsDialogOpen(false)}
                                                    >
                                                        Close
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        variant="link"
                                                        onClick={() => setIsDialogOpen(false)}
                                                    >
                                                        <a href={`/blog/${selectedPost.slug}`} target="_blank" rel="noopener noreferrer">
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