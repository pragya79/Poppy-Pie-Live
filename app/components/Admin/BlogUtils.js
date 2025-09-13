// Blog utility functions and constants

export const categories = [
    "Digital Marketing",
    "Branding",
    "Content Marketing",
    "Social Media",
    "Email Marketing",
    "SEO",
    "PPC",
    "Analytics"
]

export const placeholderImage = "/images/placeholder-image.jpg"

// Format date for display
export const formatDate = (dateString) => {
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

// Generate slug from title
export const generateSlugFromTitle = (title) => {
    return title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
}

// Alternative slug function for backward compatibility
export const generateSlug = generateSlugFromTitle

// Calculate word count from HTML content
export const calculateWordCount = (content) => {
    if (!content) return 0

    const plainText = content
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()

    return plainText === "" ? 0 : plainText.split(/\s+/).length
}

// Calculate character count from HTML content
export const calculateCharCount = (content) => {
    if (!content) return 0

    const plainText = content
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()

    return plainText.length
}

// Calculate estimated reading time
export const calculateReadingTime = (wordCount) => {
    const wordsPerMinute = 200
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

// Prepare content for preview with responsive images
export const prepareContentForPreview = (content) => {
    return content?.replace(/<img /g, '<img class="max-w-full h-auto rounded-lg my-4" ') || ""
}

// Mock image search results
export const getMockImageResults = () => [
    { id: 1, url: "/images/blog1.jpg", alt: "Mock image 1", thumbnail: "/images/blog1.jpg" },
    { id: 2, url: "/images/blog2.jpg", alt: "Mock image 2", thumbnail: "/images/blog2.jpg" },
    { id: 3, url: "/images/blog3.jpg", alt: "Mock image 3", thumbnail: "/images/blog3.jpg" },
    { id: 4, url: "/images/blog4.jpg", alt: "Mock image 4", thumbnail: "/images/blog4.jpg" },
    { id: 5, url: placeholderImage, alt: "Mock image 5", thumbnail: placeholderImage },
]

// Generate unique post ID
export const generatePostId = () => {
    return `POST-${Math.floor(Math.random() * 10000).toString().padStart(3, "0")}`
}

// Process tags from string to array
export const processTags = (tagsString) => {
    return tagsString
        ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        : []
}

// Custom image upload handler for Cloudinary
export const createImageUploadHandler = (setError) => {
    return function handleImageUpload() {
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
}

// Create Quill modules configuration
export const createQuillModules = (imageUploadHandler) => ({
    toolbar: {
        container: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
        handlers: {
            image: imageUploadHandler
        }
    }
})

// API functions
export const fetchBlogPosts = async () => {
    const response = await fetch('/api/posts')
    if (!response.ok) {
        throw new Error('Failed to fetch blog posts')
    }
    const data = await response.json()
    // Handle both old and new API response formats
    return data.posts || data || []
}

export const saveBlogPost = async (postData, isNewPost, editingPostId) => {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const finalPostData = {
        ...postData,
        author: "Admin",
        publicUrl: postData.status === "published" ? `${baseUrl}/blog/${postData.slug}.html` : ""
    }

    let response
    if (isNewPost) {
        response = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalPostData)
        })
    } else {
        response = await fetch(`/api/posts/${editingPostId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalPostData)
        })
    }

    if (!response.ok) {
        throw new Error(`Failed to ${isNewPost ? 'create' : 'update'} post`)
    }

    return response.json()
}

export const publishPost = async (postData) => {
    const publishResponse = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            url: postData.publicUrl,
            title: postData.title,
            content: postData.content,
            featuredImage: postData.featuredImage,
            category: postData.category,
            tags: postData.tags,
            author: postData.author,
            publishedDate: postData.publishedDate || new Date().toISOString()
        })
    })

    if (!publishResponse.ok) {
        throw new Error('Failed to publish post publicly')
    }

    return publishResponse.json()
}

export const deleteBlogPost = async (id) => {
    const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error('Failed to delete post')
    }

    return response.json()
}

export const updatePostStatus = async (id, newStatus, postData) => {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const updatedPostData = {
        ...postData,
        status: newStatus,
        publishedDate: newStatus === 'published' && !postData.publishedDate
            ? new Date().toISOString()
            : postData.publishedDate,
        tags: postData.tags || [],
        publicUrl: newStatus === "published" ? `${baseUrl}/blog/${postData.slug}.html` : ""
    }

    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPostData)
    })

    if (!response.ok) {
        throw new Error(`Failed to ${newStatus === 'published' ? 'publish' : 'unpublish'} post`)
    }

    return response.json()
}
