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
    Edit,
    Trash2,
    Plus,
    Calendar,
    User,
    Image as ImageIcon,
    Tag,
    Eye
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
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/app/components/context/AuthProvider"
import { useRouter } from "next/navigation"
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
})
import 'react-quill-new/dist/quill.snow.css'

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
    const [editingPost, setEditingPost] = useState(null)
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [isNewPost, setIsNewPost] = useState(false)
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [previewPost, setPreviewPost] = useState(null)

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        featuredImage: "",
        category: "",
        tags: "",
        status: "draft",
        publicUrl: ""
    })

    const { user, isAuthenticated, loading } = useAuth()
    const router = useRouter()

    // Quill toolbar modules with custom image handler
    const quillModules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: handleImageUpload
            }
        }
    }), [])

    // Custom image upload handler for Cloudinary
    function handleImageUpload() {
        const editor = this.quill
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.onchange = async () => {
            const file = input.files[0]
            if (file) {
                try {
                    const formData = new FormData()
                    formData.append('file', file)
                    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

                    const response = await fetch(
                        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                        {
                            method: 'POST',
                            body: formData
                        }
                    )

                    const data = await response.json()
                    if (data.secure_url) {
                        const range = editor.getSelection()
                        editor.insertEmbed(range.index, 'image', data.secure_url)
                    } else {
                        throw new Error('Failed to upload image')
                    }
                } catch (error) {
                    console.error('Image upload failed:', error)
                    setError('Failed to upload image to Cloudinary')
                }
            }
        }
    }

    // Fetch blog posts from API
    useEffect(() => {
        const fetchBlogPosts = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('/api/posts')
                if (!response.ok) {
                    throw new Error('Failed to fetch blog posts')
                }
                const data = await response.json()
                setBlogPosts(data)
                setFilteredPosts(data)
            } catch (error) {
                setError(error.message)
                console.error('Failed to fetch blog posts:', error)
            } finally {
                setIsLoading(false)
            }
        }

        if (!loading && isAuthenticated) {
            fetchBlogPosts()
        } else if (!loading && !isAuthenticated) {
            router.push('/login')
        }
    }, [loading, isAuthenticated, router])

    // Handle filtering and searching
    useEffect(() => {
        let result = [...blogPosts]

        if (statusFilter !== "all") {
            result = result.filter(post => post.status === statusFilter)
        }

        if (categoryFilter !== "all") {
            result = result.filter(post => post.category === categoryFilter)
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(post =>
                post.title.toLowerCase().includes(term) ||
                post.content.toLowerCase().includes(term) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term)))
            )
        }

        setFilteredPosts(result)
    }, [blogPosts, statusFilter, categoryFilter, searchTerm])

    // Handle edit post
    const handleEditPost = (post) => {
        setEditingPost(post)
        setIsNewPost(false)
        setFormData({
            title: post.title,
            slug: post.slug,
            content: post.content,
            featuredImage: post.featuredImage,
            category: post.category,
            tags: post.tags ? post.tags.join(", ") : "",
            status: post.status,
            publicUrl: post.publicUrl || ""
        })
        setIsEditorOpen(true)
    }

    // Handle new post
    const handleNewPost = () => {
        setEditingPost(null)
        setIsNewPost(true)
        setFormData({
            title: "",
            slug: "",
            content: "",
            featuredImage: "",
            category: categories[0],
            tags: "",
            status: "draft",
            publicUrl: ""
        })
        setIsEditorOpen(true)
    }

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        if (name === 'title' && isNewPost) {
            const slug = value
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/\s+/g, '-')
            setFormData(prev => ({
                ...prev,
                slug
            }))
        }
    }

    // Handle content change in Quill editor
    const handleContentChange = (content) => {
        setFormData(prev => ({
            ...prev,
            content
        }))
    }

    // Handle save post
    const handleSavePost = async () => {
        if (!formData.title || !formData.content) {
            setError("Title and content are required")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const processedTags = formData.tags
                ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                : []

            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
            const postData = {
                ...formData,
                tags: processedTags,
                author: "Admin",
                publicUrl: formData.status === "published" ? `${baseUrl}/blog/${formData.slug}.html` : ""
            }

            let response;
            if (isNewPost) {
                response = await fetch('/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                })
            } else {
                response = await fetch(`/api/posts/${editingPost._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                })
            }

            if (!response.ok) {
                throw new Error(`Failed to ${isNewPost ? 'create' : 'update'} post`)
            }

            const updatedPost = await response.json()

            // If the post is published, notify the backend to make it public and request indexing
            if (postData.status === "published") {
                try {
                    const publishResponse = await fetch('/api/publish', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            url: postData.publicUrl,
                            title: postData.title,
                            content: postData.content,
                            featuredImage: postData.featuredImage,
                            category: postData.category,
                            tags: postData.tags,
                            author: postData.author,
                            publishedDate: updatedPost.publishedDate || new Date().toISOString()
                        })
                    })

                    if (!publishResponse.ok) {
                        throw new Error('Failed to publish post publicly')
                    }
                } catch (error) {
                    console.error('Failed to notify backend for public publishing:', error)
                    setError('Post saved, but failed to publish publicly')
                }
            }

            if (isNewPost) {
                setBlogPosts(prev => [updatedPost, ...prev])
            } else {
                setBlogPosts(prev => prev.map(post =>
                    post._id === updatedPost._id ? updatedPost : post
                ))
            }

            setIsEditorOpen(false)
            console.log(`Post ${isNewPost ? 'created' : 'updated'} successfully!`)
        } catch (error) {
            setError(error.message)
            console.error(`Failed to ${isNewPost ? 'create' : 'update'} post:`, error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle delete post
    const handleDeletePost = async (id) => {
        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete post')
            }

            setBlogPosts(prev => prev.filter(post => post._id !== id))
            setConfirmDeleteId(null)
            console.log("Post deleted successfully!")
        } catch (error) {
            setError(error.message)
            console.error("Failed to delete post:", error)
        }
    }

    // Handle publish/unpublish post
    const handleStatusChange = async (id, newStatus) => {
        try {
            const post = blogPosts.find(post => post._id === id)
            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
            const updatedPostData = {
                ...post,
                status: newStatus,
                publishedDate: newStatus === 'published' && !post.publishedDate
                    ? new Date().toISOString()
                    : post.publishedDate,
                tags: post.tags || [],
                publicUrl: newStatus === "published" ? `${baseUrl}/blog/${post.slug}.html` : ""
            }

            const response = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPostData)
            })

            if (!response.ok) {
                throw new Error(`Failed to ${newStatus === 'published' ? 'publish' : 'unpublish'} post`)
            }

            const updatedPost = await response.json()

            // If the post is published, notify the backend to make it public and request indexing
            if (newStatus === "published") {
                try {
                    const publishResponse = await fetch('/api/publish', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            url: updatedPostData.publicUrl,
                            title: updatedPostData.title,
                            content: updatedPostData.content,
                            featuredImage: updatedPostData.featuredImage,
                            category: updatedPostData.category,
                            tags: updatedPostData.tags,
                            author: updatedPostData.author,
                            publishedDate: updatedPostData.publishedDate
                        })
                    })

                    if (!publishResponse.ok) {
                        throw new Error('Failed to publish post publicly')
                    }
                } catch (error) {
                    console.error('Failed to notify backend for public publishing:', error)
                    setError('Post published, but failed to make it public')
                }
            }

            setBlogPosts(prev => prev.map(post =>
                post._id === id ? updatedPost : post
            ))

            console.log(`Post ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`)
        } catch (error) {
            setError(error.message)
            console.error(`Failed to ${newStatus === 'published' ? 'publish' : 'unpublish'} post:`, error)
        }
    }

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

    // Handle preview post
    const handlePreviewPost = (post) => {
        setPreviewPost(post)
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
            {error && <div className="text-red-500 text-center">{error}</div>}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
                    <p className="text-muted-foreground">Create and manage your blog content</p>
                </div>
                <Button onClick={handleNewPost} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>New Post</span>
                </Button>
            </div>

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
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <Tag className="h-4 w-4" />
                                        <span>{post.category}</span>
                                    </div>
                                    <CardTitle className="text-base font-semibold line-clamp-2 h-12">{post.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div
                                        className="text-sm text-gray-600 line-clamp-3 h-[4.5rem]"
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(post.publishedDate || post.createdAt)}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t pt-4 mt-auto">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <User className="h-4 w-4" />
                                        <span>{post.author}</span>
                                        {post.status === 'published' && (
                                            <>
                                                <span className="mx-1">•</span>
                                                <span>{post.views || 0} views</span>
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
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => setConfirmDeleteId(post._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handlePreviewPost(post)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <DialogContent className="w-screen h-screen p-0">
                    <DialogHeader className="p-6">
                        <DialogTitle className="text-xl">
                            {isNewPost ? "Create New Post" : "Edit Post"}
                        </DialogTitle>
                        <DialogDescription>
                            {isNewPost
                                ? "Add a new blog post to your website"
                                : "Make changes to your existing blog post"
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="content" className="w-full px-6">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Post Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="Enter post title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="content">Content</Label>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={handleContentChange}
                                        modules={quillModules}
                                        className="mt-1 h-64"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="slug">URL Slug</Label>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        placeholder="post-url-slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        This will be used in the post URL
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(category => (
                                                <SelectItem key={category} value={category}>{category}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="tags">Tags</Label>
                                <Input
                                    id="tags"
                                    name="tags"
                                    placeholder="Enter tags separated by commas"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    className="mt-1"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Example: marketing, social media, branding
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="featuredImage">Thumbnail Image URL</Label>
                                <Input
                                    id="featuredImage"
                                    name="featuredImage"
                                    placeholder="https://example.com/thumbnail.jpg"
                                    value={formData.featuredImage}
                                    onChange={handleInputChange}
                                    className="mt-1"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    This image will be used as the post thumbnail
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="status">Publication Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="p-6">
                        <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSavePost}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save Post"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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

            <Dialog open={!!previewPost} onOpenChange={() => setPreviewPost(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Post Preview</DialogTitle>
                        <DialogDescription>
                            This is how your post would appear on a search result or PoppyPie blog page.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4">
                        <div className="bg-white shadow-md p-4 rounded-lg">
                            <h3 className="text-lg font-bold">{previewPost?.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: previewPost?.content }} />
                            {previewPost?.status === "published" && previewPost?.publicUrl ? (
                                <a
                                    href={previewPost.publicUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline mt-2 block"
                                >
                                    View on PoppyPie
                                </a>
                            ) : (
                                <p className="text-sm text-gray-500 mt-2">Not published yet</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                URL: {previewPost?.publicUrl || "Not available"}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPreviewPost(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}