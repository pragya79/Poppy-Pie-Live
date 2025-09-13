import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const PreviewDialog = ({
    post,
    isOpen,
    onOpenChange
}) => {
    if (!post) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Post Preview</DialogTitle>
                    <DialogDescription>
                        This is how your post would appear on a search result or PoppyPie blog page.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4">
                    <div className="bg-white shadow-md p-4 rounded-lg">
                        <h3 className="text-lg font-bold">{post.title}</h3>
                        <p
                            className="text-sm text-gray-600 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                        {post.status === "published" && post.publicUrl ? (
                            <a
                                href={post.publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline mt-2 block"
                            >
                                View on PoppyPie
                            </a>
                        ) : (
                            <p className="text-sm text-gray-500 mt-2">Not published yet</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                            URL: {post.publicUrl || "Not available"}
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PreviewDialog
