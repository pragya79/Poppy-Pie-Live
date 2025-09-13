"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"
import Link from "next/link"
import BlogFilters from "@/app/components/Admin/BlogFilters"
import BlogPostCard from "@/app/components/Admin/BlogPostCard"
import BlogEditor from "@/app/components/Admin/BlogEditor"
import ConfirmDeleteDialog from "@/app/components/Admin/ConfirmDeleteDialog"
import PreviewDialog from "@/app/components/Admin/PreviewDialog"
import { useBlogPosts, useBlogFilters, useBlogEditor } from "@/app/components/Admin/BlogHooks"
import { categories } from "@/app/components/Admin/BlogUtils"
import 'react-quill-new/dist/quill.snow.css'

export default function AdminBlog() {
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    const [previewPost, setPreviewPost] = useState(null)

    // Use custom hooks for state management
    const {
        blogPosts,
        setBlogPosts,
        filteredPosts,
        setFilteredPosts,
        isLoading,
        error,
        setError,
        handleDeletePost,
        handleStatusChange
    } = useBlogPosts()

    const {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        categoryFilter,
        setCategoryFilter,
        clearFilters
    } = useBlogFilters(blogPosts, setFilteredPosts)

    const {
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
    } = useBlogEditor(setBlogPosts, setError)

    // Handle preview post
    const handlePreviewPost = (post) => {
        setPreviewPost(post)
    }

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (confirmDeleteId) {
            await handleDeletePost(confirmDeleteId)
            setConfirmDeleteId(null)
        }
    }

    // Check if filters are active
    const hasActiveFilters = searchTerm || statusFilter !== "all" || categoryFilter !== "all"

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {error && <div className="text-red-500 text-center">{error}</div>}

            {/* Header */}
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

            {/* Filters */}
            <BlogFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
            />

            {/* Posts Grid */}
            <div>
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No blog posts found</p>
                        {hasActiveFilters && (
                            <Button
                                variant="link"
                                onClick={clearFilters}
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <BlogPostCard
                                key={post._id}
                                post={post}
                                onEdit={handleEditPost}
                                onDelete={setConfirmDeleteId}
                                onPreview={handlePreviewPost}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Blog Editor Dialog */}
            <BlogEditor
                isOpen={isEditorOpen}
                onOpenChange={setIsEditorOpen}
                isNewPost={isNewPost}
                isSubmitting={isSubmitting}
                formData={formData}
                setFormData={setFormData}
                quillModules={quillModules}
                onInputChange={handleInputChange}
                onContentChange={handleContentChange}
                onSave={handleSavePost}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDeleteDialog
                isOpen={!!confirmDeleteId}
                onOpenChange={() => setConfirmDeleteId(null)}
                onConfirm={handleDeleteConfirm}
            />

            {/* Preview Dialog */}
            <PreviewDialog
                post={previewPost}
                isOpen={!!previewPost}
                onOpenChange={() => setPreviewPost(null)}
            />
        </div>
    )
}