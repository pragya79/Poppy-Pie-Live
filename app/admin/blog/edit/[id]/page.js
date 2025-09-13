// app/admin/blog/edit/[id]/page.js
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/components/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { ArrowLeft, Save, Eye, Clock, CheckCircle, AlertCircle, Loader2, ImagePlus, Trash2 } from "lucide-react";
import { categories } from "@/app/components/Admin/BlogUtils";
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function EditBlogPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        featuredImage: "",
        category: categories[0],
        tags: "",
        status: "draft",
        excerpt: ""
    });

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [autoSaveStatus, setAutoSaveStatus] = useState('idle'); // 'idle', 'saving', 'saved', 'error'
    const [lastSaved, setLastSaved] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [showPreview, setShowPreview] = useState(false);
    const [featuredImageUpload, setFeaturedImageUpload] = useState(false);

    // Validation helper
    const validateForm = () => {
        const errors = {};

        if (!formData.title.trim()) {
            errors.title = "Title is required";
        }

        if (!formData.content.trim() || formData.content === '<p><br></p>') {
            errors.content = "Content is required";
        }

        if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
            errors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Auto-save functionality
    const autoSave = useCallback(async () => {
        if (!formData.title || !formData.content) return;

        setAutoSaveStatus('saving');

        try {
            const tags = formData.tags
                ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                : [];

            const postData = {
                ...formData,
                tags,
                status: 'draft' // Always save as draft for auto-save
            };

            const response = await fetch(`/api/posts/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                setAutoSaveStatus('saved');
                setLastSaved(new Date());
                setTimeout(() => setAutoSaveStatus('idle'), 2000);
            } else {
                setAutoSaveStatus('error');
                setTimeout(() => setAutoSaveStatus('idle'), 3000);
            }
        } catch (error) {
            setAutoSaveStatus('error');
            setTimeout(() => setAutoSaveStatus('idle'), 3000);
        }
    }, [formData, params.id]);

    // Auto-save effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.title && formData.content && autoSaveStatus === 'idle') {
                autoSave();
            }
        }, 3000); // Auto-save after 3 seconds of inactivity

        return () => clearTimeout(timer);
    }, [formData, autoSave, autoSaveStatus]);

    // Quill editor configuration
    const quillModules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                image: handleImageUpload
            }
        }
    }), []);

    const quillFormats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video',
        'color', 'background',
        'align', 'script'
    ];

    // Handle image upload for Quill editor
    function handleImageUpload() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                try {
                    // Show loading indicator
                    const quill = this.quill;
                    const range = quill.getSelection();

                    // Insert loading placeholder
                    quill.insertEmbed(range.index, 'image', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+');

                    // Upload to Cloudinary
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('folder', 'blog');

                    const response = await fetch('/api/upload/image', {
                        method: 'POST',
                        body: formData,
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.error || 'Failed to upload image');
                    }

                    // Replace loading placeholder with actual image
                    const currentContents = quill.getContents();
                    const newContents = currentContents.ops.map(op => {
                        if (op.insert && op.insert.image && op.insert.image.includes('data:image/svg+xml')) {
                            return { insert: { image: result.data.url } };
                        }
                        return op;
                    });

                    quill.setContents(newContents);

                    // Show success message briefly
                    setSuccess('Image uploaded successfully!');
                    setTimeout(() => setSuccess(''), 2000);

                } catch (error) {
                    console.error('Image upload failed:', error);
                    setError(`Failed to upload image: ${error.message}`);

                    // Remove loading placeholder on error
                    const quill = this.quill;
                    const currentContents = quill.getContents();
                    const newContents = currentContents.ops.filter(op =>
                        !(op.insert && op.insert.image && op.insert.image.includes('data:image/svg+xml'))
                    );
                    quill.setContents(newContents);

                    setTimeout(() => setError(''), 3000);
                }
            }
        };
    }

    // Check authentication
    useEffect(() => {
        if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, user, router]);

    // Fetch post data
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/posts/${params.id}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Post not found");
                    }
                    throw new Error("Failed to load post data");
                }

                const postData = await response.json();
                setFormData({
                    title: postData.title || "",
                    slug: postData.slug || "",
                    content: postData.content || "",
                    featuredImage: postData.featuredImage || "",
                    category: postData.category || categories[0],
                    tags: postData.tags ? postData.tags.join(", ") : "",
                    status: postData.status || "draft",
                    excerpt: postData.excerpt || ""
                });
            } catch (error) {
                console.error("Failed to fetch post:", error);
                setError(error.message || "Failed to load post data");
            } finally {
                setLoading(false);
            }
        };

        if (params.id && isAuthenticated) {
            fetchPost();
        }
    }, [params.id, isAuthenticated]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear validation error for this field
        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    // Handle featured image upload
    const handleFeaturedImageUpload = async (file) => {
        setFeaturedImageUpload(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'blog');

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to upload image');
            }

            handleInputChange('featuredImage', result.data.url);
            setSuccess('Featured image uploaded successfully!');
            setTimeout(() => setSuccess(''), 2000);

        } catch (error) {
            console.error('Featured image upload failed:', error);
            setError(`Failed to upload featured image: ${error.message}`);
            setTimeout(() => setError(''), 3000);
        } finally {
            setFeaturedImageUpload(false);
        }
    };

    // Handle content change from Quill editor
    const handleContentChange = useCallback((content) => {
        setFormData(prev => ({
            ...prev,
            content
        }));
    }, []);

    const handleSubmit = async (e, isDraft = false) => {
        e.preventDefault();

        if (!isDraft && !validateForm()) {
            setError("Please fix the validation errors before submitting");
            return;
        }

        setIsSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const tags = formData.tags
                ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                : [];

            const postData = {
                ...formData,
                tags,
                status: isDraft ? 'draft' : formData.status
            };

            const response = await fetch(`/api/posts/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update post');
            }

            const updatedPost = await response.json();
            setSuccess(`Post ${isDraft ? 'saved as draft' : 'updated'} successfully!`);

            // Redirect after success
            setTimeout(() => {
                router.push('/admin/blog');
            }, 1500);

        } catch (error) {
            console.error('Error updating post:', error);
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                <p className="text-gray-600">Loading blog post...</p>
            </div>
        );
    }

    if (error && !formData.title) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-gray-700 mb-6">{error}</p>
                <Button onClick={() => router.push('/admin/blog')}>
                    Back to Blog Posts
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/admin/blog')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Blog Post</h1>
                </div>

                {/* Auto-save status */}
                <div className="flex items-center gap-2 text-sm">
                    {autoSaveStatus === 'saving' && (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                            <span className="text-blue-600">Saving...</span>
                        </>
                    )}
                    {autoSaveStatus === 'saved' && (
                        <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">Auto-saved</span>
                        </>
                    )}
                    {autoSaveStatus === 'error' && (
                        <>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">Save failed</span>
                        </>
                    )}
                    {lastSaved && autoSaveStatus === 'idle' && (
                        <>
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-500">
                                Last saved {lastSaved.toLocaleTimeString()}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Post Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Title */}
                        <div>
                            <Label htmlFor="title" className="flex items-center gap-2">
                                Title
                                <span className="text-red-500">*</span>
                                {validationErrors.title && (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Enter post title"
                                required
                                className={validationErrors.title ? 'border-red-500 focus:border-red-500' : ''}
                            />
                            {validationErrors.title && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                            )}
                        </div>

                        {/* Slug */}
                        <div>
                            <Label htmlFor="slug" className="flex items-center gap-2">
                                Slug
                                {validationErrors.slug && (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                            </Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => handleInputChange('slug', e.target.value)}
                                placeholder="post-url-slug"
                                className={validationErrors.slug ? 'border-red-500 focus:border-red-500' : ''}
                            />
                            {validationErrors.slug && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.slug}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-1">
                                Leave empty to auto-generate from title
                            </p>
                        </div>

                        {/* Category and Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Featured Image URL */}
                        <div>
                            <Label htmlFor="featuredImage">Featured Image</Label>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        id="featuredImage"
                                        value={formData.featuredImage}
                                        onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                                        placeholder="https://example.com/image.jpg or upload below"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById('featured-image-upload').click()}
                                        disabled={featuredImageUpload}
                                        className="flex items-center gap-2"
                                    >
                                        {featuredImageUpload ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <ImagePlus className="h-4 w-4" />
                                        )}
                                        Upload
                                    </Button>
                                </div>

                                {/* Hidden file input */}
                                <input
                                    id="featured-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            handleFeaturedImageUpload(file);
                                        }
                                    }}
                                    className="hidden"
                                />

                                {/* Image preview */}
                                {formData.featuredImage && (
                                    <div className="relative inline-block">
                                        <Image
                                            src={formData.featuredImage}
                                            alt="Featured image preview"
                                            width={200}
                                            height={120}
                                            className="rounded-lg border object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleInputChange('featuredImage', '')}
                                            className="absolute top-1 right-1 h-6 w-6 p-0"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => handleInputChange('tags', e.target.value)}
                                placeholder="tag1, tag2, tag3"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Separate tags with commas
                            </p>
                        </div>

                        {/* Excerpt */}
                        <div>
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                value={formData.excerpt}
                                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                                placeholder="Brief description of the post"
                                rows={3}
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <Label htmlFor="content" className="flex items-center gap-2">
                                Content
                                <span className="text-red-500">*</span>
                                {validationErrors.content && (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                            </Label>
                            <div className={`mt-2 border rounded-md ${validationErrors.content ? 'border-red-500' : ''}`}>
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={handleContentChange}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Write your blog post content here..."
                                    style={{
                                        height: '300px',
                                        marginBottom: '50px',
                                        border: 'none'
                                    }}
                                />
                            </div>
                            {validationErrors.content && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.content}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-2"
                    >
                        <Eye className="h-4 w-4" />
                        {showPreview ? 'Hide Preview' : 'Preview'}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => handleSubmit(e, true)}
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Save as Draft
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <CheckCircle className="h-4 w-4" />
                        )}
                        {formData.status === 'published' ? 'Update Post' : 'Publish'}
                    </Button>
                </div>
            </form>

            {/* Preview Section */}
            {showPreview && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            Preview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <article className="prose prose-lg max-w-none">
                            {/* Preview Title */}
                            <h1 className="text-4xl font-bold mb-4">
                                {formData.title || 'Untitled Post'}
                            </h1>

                            {/* Preview Meta */}
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 border-b pb-4">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {formData.category}
                                </span>
                                <span className="capitalize text-green-600">
                                    {formData.status}
                                </span>
                                {formData.tags && (
                                    <div className="flex gap-1">
                                        {formData.tags.split(',').map((tag, index) => (
                                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Featured Image Preview */}
                            {formData.featuredImage && (
                                <div className="mb-6 relative">
                                    <Image
                                        src={formData.featuredImage}
                                        alt={formData.title || 'Blog post featured image'}
                                        width={800}
                                        height={400}
                                        className="w-full h-64 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}

                            {/* Excerpt Preview */}
                            {formData.excerpt && (
                                <div className="bg-gray-50 p-4 rounded-lg mb-6 italic">
                                    {formData.excerpt}
                                </div>
                            )}

                            {/* Content Preview */}
                            <div
                                className="prose-content"
                                dangerouslySetInnerHTML={{
                                    __html: formData.content || '<p>No content yet...</p>'
                                }}
                            />
                        </article>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}