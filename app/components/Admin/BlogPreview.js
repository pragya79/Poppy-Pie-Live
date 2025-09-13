import { Calendar, Tag, Clock, FileText } from "lucide-react"
import Image from "next/image"
import { calculateReadingTime, prepareContentForPreview } from "./BlogUtils"

const BlogPreview = ({ formData }) => {
    const wordCount = formData.content ?
        formData.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).length : 0

    if (!formData.title && !formData.content) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No content to preview</h3>
                    <p className="text-gray-500">
                        Add a title and some content to see the preview of your blog post
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
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
                            {calculateReadingTime(wordCount)} min read
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

                <div dangerouslySetInnerHTML={{ __html: prepareContentForPreview(formData.content) }} />

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
        </div>
    )
}

export default BlogPreview
