import { ArrowLeft, Save, Globe, Eye, CircleCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDate } from "./BlogUtils"

const BlogEditorHeader = ({
    formData,
    isSubmitting,
    lastSaved,
    onCancel,
    onSubmit,
    onPreview,
    onStatusChange,
}) => {
    return (
        <header className="relative top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-600">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-xl font-semibold truncate max-w-md">
                        {formData.title || "New Blog Post"}
                    </h1>
                </div>

                <div className="flex items-center space-x-2">
                    {lastSaved && (
                        <span className="text-xs text-gray-500 hidden md:inline-block">
                            Last saved: {formatDate(lastSaved)}
                        </span>
                    )}

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => onSubmit(e, true)}
                                    disabled={isSubmitting}
                                >
                                    <Save className="mr-1 h-4 w-4" />
                                    Save Draft
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Save your work without publishing</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Button variant="outline" size="sm" onClick={onPreview}>
                        <Eye className="mr-1 h-4 w-4" />
                        <span className="hidden sm:inline">Preview</span>
                    </Button>

                    <Select value={formData.status} onValueChange={onStatusChange}>
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
                        onClick={(e) => onSubmit(e, false)}
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
    )
}

export default BlogEditorHeader
