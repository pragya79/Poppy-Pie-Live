"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    Save,
    ImageIcon,
    Calendar,
    Tag,
    Clock,
    AlertTriangle,
    X,
    Globe,
    Eye,
    FileText,
    CircleCheck,
    PanelLeftClose,
    PanelLeftOpen,
    Edit3,
    ChevronUp,
    ChevronDown,
} from "lucide-react"
import RichTextEditor from "./RichTExtEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useAuth } from "@/app/components/context/AuthProvider"
import { motion, AnimatePresence } from "framer-motion"

// Categories for blog posts
const categories = [
    "Digital Marketing",
    "Branding",
    "Content Marketing",
    "Social Media",
    "Email Marketing",
    "SEO",
    "PPC",
    "Analytics",
]

// Placeholder image for preview
const placeholderImage = "/images/placeholder-image.jpg"

const BlogEditor = ({ editMode = false, postData = null }) => {
    const router = useRouter()
    const { user, isAuthenticated, loading } = useAuth()
    const editorRef = useRef(null)

    // Form state with default values or edit values
    const [formData, setFormData] = useState({
        title: editMode && postData ? postData.title : "",
        slug: editMode && postData ? postData.slug : "",
        excerpt: editMode && postData ? postData.excerpt : "",
        content: editMode && postData ? postData.content : "",
        featuredImage: editMode && postData ? postData.featuredImage : "",
        category: editMode && postData ? postData.category : categories[0],
        tags: editMode && postData ? (postData.tags || []).join(", ") : "",
        status: editMode && postData ? postData.status : "draft",
        seoTitle: editMode && postData ? postData.seoTitle || postData.title : "",
        seoDescription: editMode && postData ? postData.seoDescription || postData.excerpt : "",
        seoKeywords: editMode && postData ? postData.seoKeywords || "" : "",
    })

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [previewImage, setPreviewImage] = useState(
        editMode && postData && postData.featuredImage ? postData.featuredImage : placeholderImage,
    )
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [activeTab, setActiveTab] = useState("content")
    const [wordCount, setWordCount] = useState(0)
    const [charCount, setCharCount] = useState(0)
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [lastSaved, setLastSaved] = useState(editMode ? new Date() : null)
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
    const [advancedOptions, setAdvancedOptions] = useState(false)
    const [showSeoOptions, setShowSeoOptions] = useState(false)
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [imageSearchResults, setImageSearchResults] = useState([])
    const [imageSearchQuery, setImageSearchQuery] = useState("")
    const [selectedImage, setSelectedImage] = useState(null)

    // Save timer
    const autoSaveTimerRef = useRef(null)

    // Handle authentication and redirection
    // useEffect(() => {
    //     if (!loading && !isAuthenticated) {
    //         router.push("/login")
    //     }
    // }, [isAuthenticated, loading, router])

    // Handle unsaved changes warning
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

    // Auto-generate slug from title
    useEffect(() => {
        if (!editMode && formData.title && !formData.slug) {
            const generatedSlug = formData.title
                .toLowerCase()
                .replace(/[^\w\s]/gi, "")
                .replace(/\s+/g, "-")

            setFormData((prev) => ({
                ...prev,
                slug: generatedSlug,
            }))
        }
    }, [formData.title, editMode, formData.slug])

    // Update word and character count when content changes
    useEffect(() => {
        if (formData.content) {
            // Remove HTML tags for accurate counting
            const plainText = formData.content
                .replace(/<[^>]*>/g, " ")
                .replace(/\s+/g, " ")
                .trim()
            setCharCount(plainText.length)
            setWordCount(plainText === "" ? 0 : plainText.split(/\s+/).length)
        } else {
            setWordCount(0)
            setCharCount(0)
        }
    }, [formData.content])

    // Handle image preview when URL changes
    useEffect(() => {
        if (formData.featuredImage) {
            setPreviewImage(formData.featuredImage)
        } else {
            setPreviewImage(placeholderImage)
        }
    }, [formData.featuredImage])

    // Setup auto-save
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
    }, [formData, unsavedChanges, autoSaveEnabled])

    // Auto-save functionality
    const handleAutoSave = async () => {
        if (!unsavedChanges) return

        try {
            // In a real app, this would be an API call
            console.log("Auto-saving draft:", formData)

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 800))

            setLastSaved(new Date())
            setUnsavedChanges(false)

            // No need to show success message for auto-save
        } catch (error) {
            console.error("Failed to auto-save:", error)
            // Don't show error for auto-save failures
        }
    }

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        setUnsavedChanges(true)
    }

    // Handle rich text editor changes
    const handleEditorChange = (content) => {
        setFormData((prev) => ({
            ...prev,
            content,
        }))
        setUnsavedChanges(true)
    }

    // Handle form submission
    const handleSubmit = async (e, saveAsDraft = false) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrorMessage("")
        setSuccessMessage("")

        try {
            // Basic validation
            if (!formData.title || !formData.content) {
                setErrorMessage("Title and content are required")
                setIsSubmitting(false)
                return
            }

            // Process tags from comma-separated string to array
            const processedTags = formData.tags
                ? formData.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag !== "")
                : []

            // Set the status based on the saveAsDraft parameter
            const status = saveAsDraft ? "draft" : formData.status

            // Create the post object
            const postToSave = {
                ...formData,
                tags: processedTags,
                status,
                author: user?.name || "Admin",
                publishedDate: status === "published" ? new Date().toISOString() : null,
                seoTitle: formData.seoTitle || formData.title,
                seoDescription: formData.seoDescription || formData.excerpt,
            }

            // If editing, include the post ID
            if (editMode && postData) {
                postToSave.id = postData.id
            } else {
                // Generate a random ID for new posts
                postToSave.id = `POST-${Math.floor(Math.random() * 10000)
                    .toString()
                    .padStart(3, "0")}`
                postToSave.views = 0
            }

            // In a real app, you'd send this to your API
            console.log("Saving post:", postToSave)

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Show success message
            setSuccessMessage(
                saveAsDraft
                    ? "Draft saved successfully!"
                    : editMode
                        ? "Post updated successfully!"
                        : "Post published successfully!",
            )

            setUnsavedChanges(false)
            setLastSaved(new Date())

            // Redirect after a short delay if publishing
            if (!saveAsDraft) {
                setTimeout(() => {
                    router.push("/admin/blog")
                }, 1500)
            }
        } catch (error) {
            console.error("Error saving post:", error)
            setErrorMessage(`Failed to ${editMode ? "update" : "create"} post. Please try again.`)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Preview the blog post
    const handlePreview = () => {
        setActiveTab("preview")
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

    // Toggle sidebar
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    // Handle image upload from dialog
    const handleSelectImage = (image) => {
        setSelectedImage(image)
        setFormData((prev) => ({
            ...prev,
            featuredImage: image.url,
        }))
        setUnsavedChanges(true)
        setImageDialogOpen(false)
    }

    // Mock image search
    const handleImageSearch = async (e) => {
        e.preventDefault()
        // In a real application, this would call an image search API like Unsplash or Pexels
        const mockResults = [
            { id: 1, url: "/images/blog1.jpg", alt: "Mock image 1", thumbnail: "/images/blog1.jpg" },
            { id: 2, url: "/images/blog2.jpg", alt: "Mock image 2", thumbnail: "/images/blog2.jpg" },
            { id: 3, url: "/images/blog3.jpg", alt: "Mock image 3", thumbnail: "/images/blog3.jpg" },
            { id: 4, url: "/images/blog4.jpg", alt: "Mock image 4", thumbnail: "/images/blog4.jpg" },
            { id: 5, url: placeholderImage, alt: "Mock image 5", thumbnail: placeholderImage },
        ]

        setImageSearchResults(mockResults)
    }

    // Format date for display
    const formatDate = (date) => {
        if (!date) return "Never"

        const d = new Date(date)
        return (
            d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
            ", " +
            d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
        )
    }

    // Calculate estimated reading time
    const calculateReadingTime = () => {
        const wordsPerMinute = 200
        return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    // Prepare the content for preview
    const previewContent = () => {
        // Enhance content with responsive image styling
        return formData.content?.replace(/<img /g, '<img class="max-w-full h-auto rounded-lg my-4" ') || ""
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header toolbar */}
            <header className="relative top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={handleCancel} className="text-gray-600">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back
                        </Button>
                        <h1 className="text-xl font-semibold truncate max-w-md">{formData.title || "New Blog Post"}</h1>
                    </div>

                    <div className="flex items-center space-x-2">
                        {lastSaved && (
                            <span className="text-xs text-gray-500 hidden md:inline-block">Last saved: {formatDate(lastSaved)}</span>
                        )}

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={(e) => handleSubmit(e, true)} disabled={isSubmitting}>
                                        <Save className="mr-1 h-4 w-4" />
                                        Save Draft
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Save your work without publishing</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <Button variant="outline" size="sm" onClick={handlePreview}>
                            <Eye className="mr-1 h-4 w-4" />
                            <span className="hidden sm:inline">Preview</span>
                        </Button>

                        <Select
                            value={formData.status}
                            onValueChange={(value) => {
                                setFormData((prev) => ({ ...prev, status: value }))
                                setUnsavedChanges(true)
                            }}
                        >
                            <SelectTrigger className="w-[110px] h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            size="sm"
                            onClick={(e) => handleSubmit(e, false)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                    {formData.status === "published" ? "Publishing..." : "Saving..."}
                                </>
                            ) : (
                                <>
                                    {formData.status === "published" ? (
                                        <>
                                            <Globe className="mr-1 h-4 w-4" />
                                            Publish
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-1 h-4 w-4" />
                                            Save
                                        </>
                                    )}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Success/error messages */}
            <AnimatePresence>
                {successMessage && (
                    <motion.div
                        className="container mx-auto px-4 mt-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center text-green-700">
                            <CircleCheck className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                            <span>{successMessage}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-auto text-green-700 hover:bg-green-100 p-1 h-auto"
                                onClick={() => setSuccessMessage("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {errorMessage && (
                    <motion.div
                        className="container mx-auto px-4 mt-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center text-red-700">
                            <AlertTriangle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" />
                            <span>{errorMessage}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-auto text-red-700 hover:bg-red-100 p-1 h-auto"
                                onClick={() => setErrorMessage("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main editor area */}
                    <div className={`${sidebarCollapsed ? "lg:w-full" : "lg:w-3/4"} transition-all duration-300`}>
                        <Card className="shadow-sm">
                            <CardContent className="p-0">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <div className="border-b border-gray-200">
                                        <div className="flex justify-between items-center px-6 py-3">
                                            <TabsList className="bg-transparent border-b-0">
                                                <TabsTrigger
                                                    value="content"
                                                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-3 py-2"
                                                >
                                                    <Edit3 className="h-4 w-4 mr-2" />
                                                    Write
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="preview"
                                                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-3 py-2"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Preview
                                                </TabsTrigger>
                                            </TabsList>

                                            <div className="text-xs text-gray-500 flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                <span>{calculateReadingTime()} min read</span>
                                                <span className="mx-2">•</span>
                                                <span>{wordCount} words</span>
                                            </div>
                                        </div>
                                    </div>

                                    <TabsContent value="content" className="p-0 m-0">
                                        <div className="px-6 py-4">
                                            <Input
                                                id="title"
                                                name="title"
                                                placeholder="Post title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="border-0 border-b border-gray-200 rounded-none px-0 text-2xl font-bold mb-4 focus-visible:ring-0 focus-visible:border-gray-400"
                                            />

                                            <Textarea
                                                id="excerpt"
                                                name="excerpt"
                                                placeholder="Write a brief excerpt or summary of your post (shown in listings and search results)"
                                                value={formData.excerpt}
                                                onChange={handleInputChange}
                                                className="min-h-[70px] mb-6 resize-none"
                                            />
                                        </div>

                                        <div>
                                            <RichTextEditor
                                                value={formData.content}
                                                onChange={handleEditorChange}
                                                placeholder="Start writing your blog post..."
                                                minHeight="500px"
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="preview" className="p-0 m-0">
                                        <div className="p-6 max-w-4xl mx-auto">
                                            {formData.title || formData.content ? (
                                                <div className="prose max-w-full">
                                                    <div className="mb-8">
                                                        <h1 className="text-3xl font-bold mb-3">{formData.title || "Untitled Post"}</h1>

                                                        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-5">
                                                            <span className="flex items-center mr-4 mb-2">
                                                                <Calendar className="h-4 w-4 mr-1" />
                                                                {new Date().toLocaleDateString("en-US", {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                })}
                                                            </span>
                                                            <span className="flex items-center mr-4 mb-2">
                                                                <Clock className="h-4 w-4 mr-1" />
                                                                {calculateReadingTime()} min read
                                                            </span>
                                                            {formData.category && (
                                                                <span className="flex items-center mb-2">
                                                                    <Tag className="h-4 w-4 mr-1" />
                                                                    {formData.category}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {formData.excerpt && (
                                                            <div className="bg-gray-50 border-l-4 border-gray-200 p-4 italic mb-6">
                                                                {formData.excerpt}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {formData.featuredImage && (
                                                        <div className="mb-8">
                                                            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md">
                                                                <Image
                                                                    src={formData.featuredImage || "/placeholder.svg"}
                                                                    alt={formData.title || "Featured image"}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div dangerouslySetInnerHTML={{ __html: previewContent() }} />

                                                    {formData.tags && (
                                                        <div className="mt-8 pt-4 border-t border-gray-200">
                                                            <div className="flex flex-wrap gap-2">
                                                                {formData.tags.split(",").map((tag, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700"
                                                                    >
                                                                        {tag.trim()}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No content to preview</h3>
                                                    <p className="text-gray-500">
                                                        Add a title and some content to see the preview of your blog post
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className={`${sidebarCollapsed ? "lg:w-0 lg:overflow-hidden" : "lg:w-1/4"} transition-all duration-300`}>
                        <div className="sticky top-24">
                            <div className="lg:hidden mb-4 flex justify-end">
                                <Button variant="outline" size="sm" onClick={toggleSidebar} className="lg:hidden">
                                    {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                                    <span className="ml-2">{sidebarCollapsed ? "Show Options" : "Hide Options"}</span>
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Publish Options */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-base">Publishing Options</CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full hidden lg:flex"
                                                onClick={toggleSidebar}
                                            >
                                                {sidebarCollapsed ? (
                                                    <PanelLeftOpen className="h-4 w-4" />
                                                ) : (
                                                    <PanelLeftClose className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select
                                                value={formData.status}
                                                onValueChange={(value) => {
                                                    setFormData((prev) => ({ ...prev, status: value }))
                                                    setUnsavedChanges(true)
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                    <SelectItem value="published">Published</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Auto-save toggle */}
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Auto-save</Label>
                                                <div className="text-xs text-gray-500">Save drafts automatically</div>
                                            </div>
                                            <div>
                                                <button
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={autoSaveEnabled}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${autoSaveEnabled ? "bg-blue-600" : "bg-gray-200"}`}
                                                    onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                                                >
                                                    <span className="sr-only">Toggle auto-save</span>
                                                    <span
                                                        className={`${autoSaveEnabled ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="slug">URL Slug</Label>
                                            <Input
                                                id="slug"
                                                name="slug"
                                                placeholder="post-url-slug"
                                                value={formData.slug}
                                                onChange={handleInputChange}
                                            />
                                            <p className="text-xs text-gray-500">
                                                {formData.slug ? `yoursite.com/blog/${formData.slug}` : "Add a slug for your post URL"}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Featured Image */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">Featured Image</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                                            <Image
                                                src={previewImage || "/placeholder.svg"}
                                                alt="Featured image preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                id="featuredImage"
                                                name="featuredImage"
                                                placeholder="Image URL"
                                                value={formData.featuredImage}
                                                onChange={handleInputChange}
                                                className="text-sm"
                                            />

                                            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        <ImageIcon className="h-4 w-4 mr-2" />
                                                        Browse
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[600px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Select an image</DialogTitle>
                                                        <DialogDescription>Search for an image or upload your own.</DialogDescription>
                                                    </DialogHeader>

                                                    <div className="space-y-4 py-4">
                                                        <form onSubmit={handleImageSearch} className="flex gap-2">
                                                            <Input
                                                                placeholder="Search for images..."
                                                                value={imageSearchQuery}
                                                                onChange={(e) => setImageSearchQuery(e.target.value)}
                                                                className="flex-1"
                                                            />
                                                            <Button type="submit">Search</Button>
                                                        </form>

                                                        <div className="grid grid-cols-3 gap-3 mt-4">
                                                            {imageSearchResults.map((image) => (
                                                                <div
                                                                    key={image.id}
                                                                    className={`relative aspect-video rounded-md overflow-hidden border-2 cursor-pointer ${selectedImage?.id === image.id ? "border-blue-600" : "border-transparent"
                                                                        }`}
                                                                    onClick={() => handleSelectImage(image)}
                                                                >
                                                                    <Image
                                                                        src={image.thumbnail || "/placeholder.svg"}
                                                                        alt={image.alt}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            ))}

                                                            {imageSearchResults.length === 0 && (
                                                                <div className="col-span-3 py-8 text-center text-gray-500">
                                                                    <ImageIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                                                                    <p>Search for images or upload your own</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                if (selectedImage) {
                                                                    handleSelectImage(selectedImage)
                                                                }
                                                            }}
                                                            disabled={!selectedImage}
                                                        >
                                                            Select Image
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Categories and Tags */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">Categories & Tags</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Category</Label>
                                            <Select
                                                value={formData.category}
                                                onValueChange={(value) => {
                                                    setFormData((prev) => ({ ...prev, category: value }))
                                                    setUnsavedChanges(true)
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category} value={category}>
                                                            {category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tags">Tags</Label>
                                            <Textarea
                                                id="tags"
                                                name="tags"
                                                placeholder="Enter tags separated by commas"
                                                value={formData.tags}
                                                onChange={handleInputChange}
                                                className="min-h-[80px]"
                                            />
                                            <p className="text-xs text-gray-500">
                                                Separate tags with commas (e.g., marketing, social media, tips)
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* SEO Options */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <div
                                            className="flex justify-between items-center cursor-pointer"
                                            onClick={() => setShowSeoOptions(!showSeoOptions)}
                                        >
                                            <CardTitle className="text-base">SEO Options</CardTitle>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                {showSeoOptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    {showSeoOptions && (
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="seoTitle">SEO Title</Label>
                                                <Input
                                                    id="seoTitle"
                                                    name="seoTitle"
                                                    placeholder="SEO title (defaults to post title)"
                                                    value={formData.seoTitle}
                                                    onChange={handleInputChange}
                                                />
                                                <div className="text-xs text-gray-500 flex justify-between">
                                                    <span>Recommended: 50-60 characters</span>
                                                    <span>{formData.seoTitle?.length || 0} chars</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="seoDescription">Meta Description</Label>
                                                <Textarea
                                                    id="seoDescription"
                                                    name="seoDescription"
                                                    placeholder="Meta description for search engines"
                                                    value={formData.seoDescription}
                                                    onChange={handleInputChange}
                                                    className="min-h-[80px]"
                                                />
                                                <div className="text-xs text-gray-500 flex justify-between">
                                                    <span>Recommended: 150-160 characters</span>
                                                    <span>{formData.seoDescription?.length || 0} chars</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="seoKeywords">Focus Keywords</Label>
                                                <Input
                                                    id="seoKeywords"
                                                    name="seoKeywords"
                                                    placeholder="Main keywords for this post"
                                                    value={formData.seoKeywords}
                                                    onChange={handleInputChange}
                                                />
                                                <p className="text-xs text-gray-500">Separate keywords with commas</p>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogEditor
