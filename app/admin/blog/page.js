"use client"

import { useState, useEffect } from "react"
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
    Edit,
    Trash2,
    Plus,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/app/components/context/AuthProvider"
import { useRouter } from "next/navigation"
import Link from "next/link"

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

export default function AdminBlog() {
    const [blogPosts, setBlogPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)

    const { user, isAuthenticated, loading } = useAuth()
    const router = useRouter()

    // Fetch blog posts (simulated)
    useEffect(() => {
        // Redirect if not authenticated
        // if (!loading && !isAuthenticated) {
        //     router.push('/login')
        //     return
        // }

        const fetchBlogPosts = async () => {
            setIsLoading(true)
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800))

                // In a real app, you would fetch from your API
                // const response = await fetch('/api/admin/blogs');
                // const data = await response.json();

                // For now, get from localStorage
                const storedBlogs = JSON.parse(localStorage.getItem('blogPosts') || '[]');

                // Sort by date (newest first)
                storedBlogs.sort((a, b) => {
                    // Handle null dates (drafts)
                    if (!a.publishedDate) return 1;
                    if (!b.publishedDate) return -1;
                    return new Date(b.publishedDate) - new Date(a.publishedDate);
                });

                setBlogPosts(storedBlogs)
                setFilteredPosts(storedBlogs)
            } catch (error) {
                console.error('Failed to fetch blog posts:', error)
            } finally {
                setIsLoading(false)
            }
        }

        // if (isAuthenticated) {
        //     fetchBlogPosts()
        // }
        fetchBlogPosts()
    }, [isAuthenticated, loading, router])

    // Handle filtering and searching
    useEffect(() => {
        let result = [...blogPosts]

        // Apply status filter
        if (statusFilter !== "all") {
            result = result.filter(post => post.status === statusFilter)
        }

        // Apply category filter
        if (categoryFilter !== "all") {
            result = result.filter(post => post.category === categoryFilter)
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(post =>
                post.title.toLowerCase().includes(term) ||
                post.excerpt.toLowerCase().includes(term) ||
                post.content.toLowerCase().includes(term) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term)))
            )
        }

        setFilteredPosts(result)
    }, [blogPosts, statusFilter, categoryFilter, searchTerm])

    // Handle edit post - redirect to edit page
    const handleEditPost = (post) => {
        router.push(`/admin/blog/edit/${post.id}`)
    }

    // Handle delete post
    const handleDeletePost = async (id) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // In a real app, you would call your API
            // await fetch(`/api/blogs/${id}`, { method: 'DELETE' });

            // For now, update localStorage
            const storedBlogs = JSON.parse(localStorage.getItem('blogPosts') || '[]');
            const updatedBlogs = storedBlogs.filter(post => post.id !== id);
            localStorage.setItem('blogPosts', JSON.stringify(updatedBlogs));

            // Remove post from state
            setBlogPosts(prev => prev.filter(post => post.id !== id));

            // Close confirmation dialog
            setConfirmDeleteId(null);

            // Show success message
            console.log("Post deleted successfully!");
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "Not published"

        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
                    <p className="text-muted-foreground">Create and manage your blog content</p>
                </div>
                <Link href="/admin/blog/create">
                    <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span>New Post</span>
                    </Button>
                </Link>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
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
                            <div className="flex items-center gap-2">
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select
                                    value={categoryFilter}
                                    onValueChange={setCategoryFilter}
                                >
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
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Blog Posts Grid */}
            <div>
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No blog posts found</p>
                        {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
                            <Button
                                variant="link"
                                onClick={() => {
                                    setSearchTerm("")
                                    setStatusFilter("all")
                                    setCategoryFilter("all")
                                }}
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <Card key={post.id} className="overflow-hidden flex flex-col h-full">
                                <div className="relative aspect-video bg-gray-100">
                                    {/* Replace with actual image component in production */}
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <ImageIcon className="h-10 w-10" />
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                        >
                                            {post.status === 'published' ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                </div>
                                <CardHeader className="pb-0">
                                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                                        <Tag className="h-3 w-3" />
                                        <span>{post.category}</span>
                                    </div>
                                    <CardTitle className="line-clamp-2 h-14">{post.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500 line-clamp-3 h-[4.5rem]">{post.excerpt}</p>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-4">
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatDate(post.publishedDate)}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t pt-4 mt-auto">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <User className="h-3 w-3" />
                                        <span>{post.author}</span>
                                        {post.status === 'published' && (
                                            <>
                                                <span className="mx-1">•</span>
                                                <span>{post.views} views</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEditPost(post)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500"
                                            onClick={() => setConfirmDeleteId(post.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this blog post? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleDeletePost(confirmDeleteId)}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}