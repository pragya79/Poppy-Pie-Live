import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/components/context/AuthProvider"
import {
    fetchBlogPosts,
    saveBlogPost,
    publishPost,
    deleteBlogPost,
    updatePostStatus,
    processTags,
    generateSlugFromTitle,
    createImageUploadHandler,
    createQuillModules
} from "./BlogUtils"

// Custom hook for managing blog posts data and filtering
export const useBlogPosts = () => {
    const [blogPosts, setBlogPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user, isAuthenticated, loading } = useAuth()
    const router = useRouter()

    // Fetch blog posts
    useEffect(() => {
        const loadBlogPosts = async () => {
            setIsLoading(true)
            try {
                const data = await fetchBlogPosts()
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
            loadBlogPosts()
        } else if (!loading && !isAuthenticated) {
            router.push('/login')
        }
    }, [loading, isAuthenticated, router])

    // Delete post
    const handleDeletePost = async (id) => {
        try {
            await deleteBlogPost(id)
            setBlogPosts(prev => prev.filter(post => post._id !== id))
            console.log("Post deleted successfully!")
        } catch (error) {
            setError(error.message)
            console.error("Failed to delete post:", error)
        }
    }

    // Update post status
    const handleStatusChange = async (id, newStatus) => {
        try {
            const post = blogPosts.find(post => post._id === id)
            const updatedPost = await updatePostStatus(id, newStatus, post)

            // If published, also make it public
            if (newStatus === "published") {
                try {
                    await publishPost(updatedPost)
                } catch (error) {
                    console.error('Failed to notify backend for public publishing:', error)
                    setError('Post published, but failed to make it public')
                }
            }

            setBlogPosts(prev => prev.map(p => p._id === id ? updatedPost : p))
            console.log(`Post ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`)
        } catch (error) {
            setError(error.message)
            console.error(`Failed to ${newStatus === 'published' ? 'publish' : 'unpublish'} post:`, error)
        }
    }

    return {
        blogPosts,
        setBlogPosts,
        filteredPosts,
        setFilteredPosts,
        isLoading,
        error,
        setError,
        handleDeletePost,
        handleStatusChange
    }
}

// Custom hook for filtering posts
export const useBlogFilters = (blogPosts, setFilteredPosts) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")

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
    }, [blogPosts, statusFilter, categoryFilter, searchTerm, setFilteredPosts])

    const clearFilters = () => {
        setSearchTerm("")
        setStatusFilter("all")
        setCategoryFilter("all")
    }

    return {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        categoryFilter,
        setCategoryFilter,
        clearFilters
    }
}

// Custom hook for blog editor
export const useBlogEditor = (setBlogPosts, setError) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [editingPost, setEditingPost] = useState(null)
    const [isNewPost, setIsNewPost] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

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

    // Quill modules with image upload handler
    const quillModules = useMemo(() => {
        const imageUploadHandler = createImageUploadHandler(setError)
        return createQuillModules(imageUploadHandler)
    }, [setError])

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
    const handleNewPost = (categories) => {
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

        // Auto-generate slug from title for new posts
        if (name === 'title' && isNewPost) {
            const slug = generateSlugFromTitle(value)
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
            const processedTags = processTags(formData.tags)
            const postData = {
                ...formData,
                tags: processedTags
            }

            const updatedPost = await saveBlogPost(postData, isNewPost, editingPost?._id)

            // If published, also make it public
            if (postData.status === "published") {
                try {
                    await publishPost(updatedPost)
                } catch (error) {
                    console.error('Failed to notify backend for public publishing:', error)
                    setError('Post saved, but failed to publish publicly')
                }
            }

            // Update the posts list
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

    return {
        isEditorOpen,
        setIsEditorOpen,
        editingPost,
        isNewPost,
        isSubmitting,
        formData,
        setFormData,
        quillModules,
        handleEditPost,
        handleNewPost,
        handleInputChange,
        handleContentChange,
        handleSavePost
    }
}
