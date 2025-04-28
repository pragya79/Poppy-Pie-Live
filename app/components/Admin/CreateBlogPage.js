"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Save,
    ImageIcon,
    Calendar,
    Tag,
    Info,
    Clock,
    AlertTriangle,
    Check,
    X
} from "lucide-react";
import RichTextEditor from "./RichTExtEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { useAuth } from "@/app/components/context/AuthProvider";
import { Label } from "@/components/ui/label";
import Image from "next/image";

// Categories for blog posts
const categories = [
    "Digital Marketing",
    "Branding",
    "Content Marketing",
    "Social Media",
    "Email Marketing",
    "SEO",
    "PPC",
    "Analytics"
];

// Placeholder image for preview
const placeholderImage = "/images/placeholder-image.jpg";

const CreateBlogPage = ({ editMode = false, postData = null }) => {
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuth();

    // Form state with default values or edit values
    const [formData, setFormData] = useState({
        title: editMode && postData ? postData.title : "",
        slug: editMode && postData ? postData.slug : "",
        excerpt: editMode && postData ? postData.excerpt : "",
        content: editMode && postData ? postData.content : "",
        featuredImage: editMode && postData ? postData.featuredImage : "",
        category: editMode && postData ? postData.category : categories[0],
        tags: editMode && postData ? (postData.tags || []).join(", ") : "",
        status: editMode && postData ? postData.status : "draft"
    });

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState(
        editMode && postData && postData.featuredImage
            ? postData.featuredImage
            : placeholderImage
    );
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [activeTab, setActiveTab] = useState("content");
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    // Handle authentication and redirection
    // useEffect(() => {
    //     if (!loading && !isAuthenticated) {
    //         router.push('/login');
    //     }
    // }, [isAuthenticated, loading, router]);

    // Handle unsaved changes warning
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (unsavedChanges) {
                const message = "You have unsaved changes. Are you sure you want to leave?";
                e.returnValue = message;
                return message;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [unsavedChanges]);

    // Auto-generate slug from title
    useEffect(() => {
        if (!editMode && formData.title && !formData.slug) {
            const generatedSlug = formData.title
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/\s+/g, '-');

            setFormData(prev => ({
                ...prev,
                slug: generatedSlug
            }));
        }
    }, [formData.title, editMode, formData.slug]);

    // Update word and character count when content changes
    useEffect(() => {
        if (formData.content) {
            // Remove HTML tags for accurate counting
            const plainText = formData.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            setCharCount(plainText.length);
            setWordCount(plainText === '' ? 0 : plainText.split(/\s+/).length);
        } else {
            setWordCount(0);
            setCharCount(0);
        }
    }, [formData.content]);

    // Handle image preview when URL changes
    useEffect(() => {
        if (formData.featuredImage) {
            setPreviewImage(formData.featuredImage);
        } else {
            setPreviewImage(placeholderImage);
        }
    }, [formData.featuredImage]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setUnsavedChanges(true);
    };

    // Handle rich text editor changes
    const handleEditorChange = (content) => {
        setFormData(prev => ({
            ...prev,
            content
        }));
        setUnsavedChanges(true);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            // Basic validation
            if (!formData.title || !formData.content) {
                setErrorMessage("Title and content are required");
                setIsSubmitting(false);
                return;
            }

            // Process tags from comma-separated string to array
            const processedTags = formData.tags
                ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                : [];

            // Create the post object
            const postToSave = {
                ...formData,
                tags: processedTags,
                author: user?.name || "Admin",
                publishedDate: formData.status === 'published' ? new Date().toISOString() : null,
            };

            // If editing, include the post ID
            if (editMode && postData) {
                postToSave.id = postData.id;
            } else {
                // Generate a random ID for new posts
                postToSave.id = `POST-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
                postToSave.views = 0;
            }

            // In a real app, you'd send this to your API
            console.log("Saving post:", postToSave);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success message
            setSuccessMessage(editMode
                ? "Post updated successfully!"
                : "Post created successfully!");

            setUnsavedChanges(false);

            // Redirect after a short delay
            setTimeout(() => {
                router.push('/admin/blog');
            }, 1500);
        } catch (error) {
            console.error("Error saving post:", error);
            setErrorMessage(`Failed to ${editMode ? 'update' : 'create'} post. Please try again.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Preview the blog post
    const handlePreview = () => {
        // Open in a new tab or show a modal preview
        // For now, we'll just switch to the preview tab
        setActiveTab("preview");
    };

    // Go back to blog list
    const handleCancel = () => {
        if (unsavedChanges) {
            if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
                router.push('/admin/blog');
            }
        } else {
            router.push('/admin/blog');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header with back button */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        onClick={handleCancel}
                        className="mr-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Posts
                    </Button>
                    <h1 className="text-2xl font-bold">
                        {editMode ? "Edit Blog Post" : "Create New Blog Post"}
                    </h1>
                </div>

                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={handlePreview}
                        disabled={!formData.content}
                    >
                        Preview
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                {editMode ? "Updating..." : "Publishing..."}
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {editMode ? "Update Post" : "Publish Post"}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Success/error messages */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    {errorMessage}
                </div>
            )}

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: Editor and content fields */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-6">
                            {/* Title input */}
                            <div>
                                <Label htmlFor="title" className="text-lg font-medium mb-2 block">
                                    Post Title
                                </Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Enter a compelling title..."
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="text-lg h-12"
                                />
                            </div>

                            {/* Excerpt textarea */}
                            <div>
                                <Label htmlFor="excerpt" className="text-lg font-medium mb-2 block">
                                    Excerpt / Summary
                                </Label>
                                <Textarea
                                    id="excerpt"
                                    name="excerpt"
                                    placeholder="Write a brief summary of your post (shown in listings and search results)"
                                    value={formData.excerpt}
                                    onChange={handleInputChange}
                                    className="min-h-[100px]"
                                />
                            </div>

                            {/* Rich text editor */}
                            <div>
                                <Label htmlFor="content" className="text-lg font-medium mb-2 block">
                                    Content
                                </Label>
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={handleEditorChange}
                                    placeholder="Start writing your blog post..."
                                    minHeight="500px"
                                    direction="rtl"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="preview">
                            {formData.content ? (
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {new Date().toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span>•</span>
                                            <Clock className="h-4 w-4" />
                                            <span>{Math.ceil(wordCount / 200)} min read</span>
                                        </div>
                                        <CardTitle className="text-3xl">{formData.title || "Untitled Post"}</CardTitle>
                                        <CardDescription className="text-lg mt-2">
                                            {formData.excerpt || "No excerpt provided"}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                                            <Image
                                                src={previewImage}
                                                alt={formData.title || "Featured image"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div
                                            className="prose max-w-none"
                                            dangerouslySetInnerHTML={{ __html: formData.content }}
                                        />
                                    </CardContent>
                                    <CardFooter className="flex justify-between border-t pt-6">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Tag className="h-4 w-4 mr-2" />
                                            <span>
                                                {formData.tags
                                                    ? formData.tags.split(',').map(tag => tag.trim()).join(', ')
                                                    : "No tags"}
                                            </span>
                                        </div>
                                        <div>
                                            Category: <span className="font-medium">{formData.category}</span>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No content to preview</h3>
                                    <p className="text-gray-500">
                                        Add some content in the editor to see a preview of your blog post
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right column: Settings and metadata */}
                <div className="space-y-6">
                    {/* Status card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Publication Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => {
                                    setFormData(prev => ({ ...prev, status: value }));
                                    setUnsavedChanges(true);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-sm text-gray-500 mb-1">
                                    <span>Words:</span>
                                    <span>{wordCount}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Characters:</span>
                                    <span>{charCount}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                            <div className="w-full flex justify-between items-center">
                                <span className="text-sm text-gray-500">Last saved: {editMode ? "2 mins ago" : "Never"}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    Save Draft
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Featured Image card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Featured Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 relative w-full h-40 rounded-md overflow-hidden border border-gray-200">
                                <Image
                                    src={previewImage}
                                    alt="Featured image preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <Input
                                id="featuredImage"
                                name="featuredImage"
                                placeholder="Enter image URL"
                                value={formData.featuredImage}
                                onChange={handleInputChange}
                            />
                            <div className="mt-2 text-xs text-gray-500 flex items-center">
                                <Info className="h-3 w-3 mr-1" />
                                Enter a direct URL to your image
                            </div>
                        </CardContent>
                    </Card>

                    {/* Categories and Tags card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Categories & Tags</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => {
                                        setFormData(prev => ({ ...prev, category: value }));
                                        setUnsavedChanges(true);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="tags">Tags</Label>
                                <Input
                                    id="tags"
                                    name="tags"
                                    placeholder="Enter tags separated by commas"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                />
                                <div className="mt-1 text-xs text-gray-500">
                                    Example: marketing, social media, SEO
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* URL Settings card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>URL Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="slug">URL Slug</Label>
                            <div className="flex items-center">
                                <span className="text-gray-500 mr-1">/blog/</span>
                                <Input
                                    id="slug"
                                    name="slug"
                                    placeholder="post-url-slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    className="flex-1"
                                />
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                                The last part of the URL (e.g., &quot;your-post-title&quot;)
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CreateBlogPage;