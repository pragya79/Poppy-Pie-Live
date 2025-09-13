"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, Save, Eye } from "lucide-react";
import { categories } from "@/app/components/Admin/BlogUtils";
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function CreateBlogPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuth();

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

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
                    // You can implement Cloudinary upload here
                    // For now, we'll use a placeholder
                    const formData = new FormData();
                    formData.append('file', file);

                    // Replace this with your actual image upload logic
                    console.log('Image selected:', file.name);

                    // For demonstration, create a local URL
                    const imageUrl = URL.createObjectURL(file);

                    // Insert image into editor
                    const quill = this.quill;
                    const range = quill.getSelection();
                    quill.insertEmbed(range.index, 'image', imageUrl);
                } catch (error) {
                    console.error('Image upload failed:', error);
                    setError('Failed to upload image');
                }
            }
        };
    }

    // Check authentication
    useEffect(() => {
        if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, user, router]);

    // Auto-generate slug from title
    const handleTitleChange = (e) => {
        const title = e.target.value;
        const slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();

        setFormData(prev => ({
            ...prev,
            title,
            slug
        }));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
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
        setIsSubmitting(true);
        setError("");
        setSuccess("");

        try {
            if (!formData.title || !formData.content) {
                throw new Error("Title and content are required");
            }

            const tags = formData.tags
                ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                : [];

            const postData = {
                ...formData,
                tags,
                status: isDraft ? 'draft' : formData.status
            };

            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create post');
            }

            const savedPost = await response.json();
            setSuccess(`Post ${isDraft ? 'saved as draft' : 'created'} successfully!`);

            // Redirect after success
            setTimeout(() => {
                router.push('/admin/blog');
            }, 1500);

        } catch (error) {
            console.error('Error creating post:', error);
            setError(error.message);
        } finally {
            setIsSubmitting(false);
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
        <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="outline"
                    onClick={() => router.push('/admin/blog')}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blog
                </Button>
                <h1 className="text-2xl font-bold">Create New Blog Post</h1>
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
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={handleTitleChange}
                                placeholder="Enter post title"
                                required
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => handleInputChange('slug', e.target.value)}
                                placeholder="post-url-slug"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Will be auto-generated from title if left empty
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
                            <Label htmlFor="featuredImage">Featured Image URL</Label>
                            <Input
                                id="featuredImage"
                                value={formData.featuredImage}
                                onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
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
                            <Label htmlFor="content">Content *</Label>
                            <div className="mt-2 border rounded-md">
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
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => handleSubmit(e, true)}
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        Save as Draft
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                    >
                        <Eye className="h-4 w-4" />
                        {formData.status === 'published' ? 'Publish' : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
}