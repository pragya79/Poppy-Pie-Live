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
        <div className="flex justify-center items-center h-screen">
                <div>Yet to Implement</div>
        </div>
    )
}