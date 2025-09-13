import { Edit, Trash2, Eye, Calendar, User, Tag, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { formatDate } from "./BlogUtils"

const BlogPostCard = ({
    post,
    onEdit,
    onDelete,
    onPreview
}) => {
    return (
        <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg">
            <div className="relative aspect-video">
                {post.featuredImage ? (
                    <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                        <ImageIcon className="h-10 w-10" />
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                        {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                </div>
            </div>

            <CardHeader className="pb-0">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Tag className="h-4 w-4" />
                    <span>{post.category}</span>
                </div>
                <CardTitle className="text-base font-semibold line-clamp-2 h-12">
                    {post.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1">
                <div
                    className="text-sm text-gray-600 line-clamp-3 h-[4.5rem]"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publishedDate || post.createdAt)}</span>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-4 mt-auto">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                    {post.status === 'published' && (
                        <>
                            <span className="mx-1">•</span>
                            <span>{post.views || 0} views</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(post)}
                        title="Edit post"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => onDelete(post._id)}
                        title="Delete post"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onPreview(post)}
                        title="Preview post"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default BlogPostCard
