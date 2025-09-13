import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import dynamic from 'next/dynamic'
import { categories } from "./BlogUtils"

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
})

const BlogEditor = ({
    isOpen,
    onOpenChange,
    isNewPost,
    isSubmitting,
    formData,
    setFormData,
    quillModules,
    onInputChange,
    onContentChange,
    onSave
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-screen min-h-auto p-0">
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
                                    onChange={onInputChange}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="content">Content</Label>
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={onContentChange}
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
                                    onChange={onInputChange}
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
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
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
                                onChange={onInputChange}
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
                                onChange={onInputChange}
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

                <DialogFooter className="p-10">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSave}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save Post"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BlogEditor
