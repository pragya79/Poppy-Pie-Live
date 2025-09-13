import { useState } from "react"
import { ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import Image from "next/image"
import { getMockImageResults } from "./BlogUtils"

const ImageSelectionDialog = ({ onImageSelect }) => {
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [imageSearchResults, setImageSearchResults] = useState([])
    const [imageSearchQuery, setImageSearchQuery] = useState("")
    const [selectedImage, setSelectedImage] = useState(null)

    // Mock image search
    const handleImageSearch = async (e) => {
        e.preventDefault()
        setImageSearchResults(getMockImageResults())
    }

    // Handle image selection
    const handleSelectImage = (image) => {
        setSelectedImage(image)
        onImageSelect(image)
        setImageDialogOpen(false)
    }

    return (
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Browse
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Select an image</DialogTitle>
                    <DialogDescription>Search for an image or upload your own.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <form onSubmit={handleImageSearch} className="flex gap-2">
                        <Input
                            placeholder="Search for images..."
                            value={imageSearchQuery}
                            onChange={(e) => setImageSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit">Search</Button>
                    </form>

                    <div className="grid grid-cols-3 gap-3 mt-4">
                        {imageSearchResults.map((image) => (
                            <div
                                key={image.id}
                                className={`relative aspect-video rounded-md overflow-hidden border-2 cursor-pointer ${selectedImage?.id === image.id ? "border-blue-600" : "border-transparent"
                                    }`}
                                onClick={() => setSelectedImage(image)}
                            >
                                <Image
                                    src={image.thumbnail || "/placeholder.svg"}
                                    alt={image.alt}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}

                        {imageSearchResults.length === 0 && (
                            <div className="col-span-3 py-8 text-center text-gray-500">
                                <ImageIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                                <p>Search for images or upload your own</p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (selectedImage) {
                                handleSelectImage(selectedImage)
                            }
                        }}
                        disabled={!selectedImage}
                    >
                        Select Image
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ImageSelectionDialog
