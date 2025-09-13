import {
    PanelLeftClose,
    PanelLeftOpen,
    ImageIcon,
    ChevronUp,
    ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import ImageSelectionDialog from "./ImageSelectionDialog"
import { categories, placeholderImage } from "./BlogUtils"

const BlogEditorSidebar = ({
    sidebarCollapsed,
    formData,
    autoSaveEnabled,
    showSeoOptions,
    previewImage,
    onToggleSidebar,
    onInputChange,
    onSelectChange,
    onAutoSaveToggle,
    onShowSeoToggle,
    onImageSelect,
}) => {
    return (
        <div className={`${sidebarCollapsed ? "lg:w-0 lg:overflow-hidden" : "lg:w-1/4"} transition-all duration-300`}>
            <div className="sticky top-24">
                <div className="lg:hidden mb-4 flex justify-end">
                    <Button variant="outline" size="sm" onClick={onToggleSidebar} className="lg:hidden">
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
                                    onClick={onToggleSidebar}
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
                                    onValueChange={(value) => onSelectChange("status", value)}
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
                                        onClick={onAutoSaveToggle}
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
                                    onChange={onInputChange}
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
                                    onChange={onInputChange}
                                    className="text-sm"
                                />

                                <ImageSelectionDialog onImageSelect={onImageSelect} />
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
                                    onValueChange={(value) => onSelectChange("category", value)}
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
                                    onChange={onInputChange}
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
                                onClick={onShowSeoToggle}
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
                                        onChange={onInputChange}
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
                                        onChange={onInputChange}
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
                                        onChange={onInputChange}
                                    />
                                    <p className="text-xs text-gray-500">Separate keywords with commas</p>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default BlogEditorSidebar
