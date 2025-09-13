import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { generateSlug, calculateWordCount, calculateCharCount } from "./BlogUtils"

// Custom hook for managing blog editor state and logic
export const useBlogEditor = (editMode = false, postData = null) => {
    const router = useRouter()

    // Form state with default values or edit values
    const [formData, setFormData] = useState({
        title: editMode && postData ? postData.title : "",
        slug: editMode && postData ? postData.slug : "",
        excerpt: editMode && postData ? postData.excerpt : "",
        content: editMode && postData ? postData.content : "",
        featuredImage: editMode && postData ? postData.featuredImage : "",
        category: editMode && postData ? postData.category : "",
        tags: editMode && postData ? (postData.tags || []).join(", ") : "",
        status: editMode && postData ? postData.status : "draft",
        seoTitle: editMode && postData ? postData.seoTitle || postData.title : "",
        seoDescription: editMode && postData ? postData.seoDescription || postData.excerpt : "",
        seoKeywords: editMode && postData ? postData.seoKeywords || "" : "",
    })

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [activeTab, setActiveTab] = useState("content")
    const [wordCount, setWordCount] = useState(0)
    const [charCount, setCharCount] = useState(0)
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [lastSaved, setLastSaved] = useState(editMode ? new Date() : null)
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
    const [showSeoOptions, setShowSeoOptions] = useState(false)

    // Save timer
    const autoSaveTimerRef = useRef(null)

    // Auto-generate slug from title
    useEffect(() => {
        if (!editMode && formData.title && !formData.slug) {
            const generatedSlug = generateSlug(formData.title)
            setFormData((prev) => ({ ...prev, slug: generatedSlug }))
        }
    }, [formData.title, editMode, formData.slug])

    // Update word and character count when content changes
    useEffect(() => {
        setCharCount(calculateCharCount(formData.content))
        setWordCount(calculateWordCount(formData.content))
    }, [formData.content])

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setUnsavedChanges(true)
    }

    // Handle rich text editor changes
    const handleEditorChange = (content) => {
        setFormData((prev) => ({ ...prev, content }))
        setUnsavedChanges(true)
    }

    // Handle select changes
    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
        setUnsavedChanges(true)
    }

    // Toggle sidebar
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    // Go back to blog list
    const handleCancel = () => {
        if (unsavedChanges) {
            if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
                router.push("/admin/blog")
            }
        } else {
            router.push("/admin/blog")
        }
    }

    // Clear messages
    const clearMessages = () => {
        setSuccessMessage("")
        setErrorMessage("")
    }

    return {
        // State
        formData,
        setFormData,
        isSubmitting,
        setIsSubmitting,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
        activeTab,
        setActiveTab,
        wordCount,
        charCount,
        unsavedChanges,
        setUnsavedChanges,
        sidebarCollapsed,
        lastSaved,
        setLastSaved,
        autoSaveEnabled,
        setAutoSaveEnabled,
        showSeoOptions,
        setShowSeoOptions,
        autoSaveTimerRef,

        // Handlers
        handleInputChange,
        handleEditorChange,
        handleSelectChange,
        toggleSidebar,
        handleCancel,
        clearMessages,
    }
}

// Custom hook for handling unsaved changes warning
export const useUnsavedChangesWarning = (unsavedChanges) => {
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (unsavedChanges) {
                const message = "You have unsaved changes. Are you sure you want to leave?"
                e.returnValue = message
                return message
            }
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [unsavedChanges])
}

// Custom hook for auto-save functionality
export const useAutoSave = (formData, unsavedChanges, autoSaveEnabled, setLastSaved, setUnsavedChanges, postId = null) => {
    const autoSaveTimerRef = useRef(null)

    const handleAutoSave = useCallback(async () => {
        if (!unsavedChanges) return

        try {
            console.log("Auto-saving draft:", formData)

            // Prepare the data for API
            const postData = {
                title: formData.title,
                slug: formData.slug,
                content: formData.content,
                featuredImage: formData.featuredImage,
                category: formData.category,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
                status: 'draft',
                excerpt: formData.excerpt,
                seoTitle: formData.seoTitle,
                seoDescription: formData.seoDescription,
                seoKeywords: formData.seoKeywords
            }

            if (postId) {
                // Update existing post
                const response = await fetch(`/api/posts/${postId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                })

                if (!response.ok) {
                    throw new Error('Failed to auto-save post')
                }
            } else {
                // Create new post as draft
                const response = await fetch('/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                })

                if (!response.ok) {
                    throw new Error('Failed to auto-save post')
                }
            }

            setLastSaved(new Date())
            setUnsavedChanges(false)
        } catch (error) {
            console.error("Failed to auto-save:", error)
        }
    }, [formData, unsavedChanges, setLastSaved, setUnsavedChanges, postId])

    useEffect(() => {
        if (autoSaveEnabled && unsavedChanges) {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current)
            }

            autoSaveTimerRef.current = setTimeout(() => {
                handleAutoSave()
            }, 30000) // Auto-save every 30 seconds
        }

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current)
            }
        }
    }, [handleAutoSave, autoSaveEnabled, unsavedChanges])

    return { handleAutoSave }
}
