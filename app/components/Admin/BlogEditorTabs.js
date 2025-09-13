import { Edit3, Eye, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import RichTextEditor from "./RichTExtEditor"
import BlogPreview from "./BlogPreview"
import { calculateReadingTime } from "./BlogUtils"

const BlogEditorTabs = ({
    activeTab,
    onTabChange,
    formData,
    wordCount,
    onInputChange,
    onEditorChange,
}) => {
    return (
        <Card className="shadow-sm">
            <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
                    <div className="border-b border-gray-200">
                        <div className="flex justify-between items-center px-6 py-3">
                            <TabsList className="bg-transparent border-b-0">
                                <TabsTrigger
                                    value="content"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-3 py-2"
                                >
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Write
                                </TabsTrigger>
                                <TabsTrigger
                                    value="preview"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-3 py-2"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Preview
                                </TabsTrigger>
                            </TabsList>

                            <div className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{calculateReadingTime(wordCount)} min read</span>
                                <span className="mx-2">•</span>
                                <span>{wordCount} words</span>
                            </div>
                        </div>
                    </div>

                    <TabsContent value="content" className="p-0 m-0">
                        <div className="px-6 py-4">
                            <Input
                                id="title"
                                name="title"
                                placeholder="Post title"
                                value={formData.title}
                                onChange={onInputChange}
                                className="border-0 border-b border-gray-200 rounded-none px-0 text-2xl font-bold mb-4 focus-visible:ring-0 focus-visible:border-gray-400"
                            />

                            <Textarea
                                id="excerpt"
                                name="excerpt"
                                placeholder="Write a brief excerpt or summary of your post (shown in listings and search results)"
                                value={formData.excerpt}
                                onChange={onInputChange}
                                className="min-h-[70px] mb-6 resize-none"
                            />
                        </div>

                        <div>
                            <RichTextEditor
                                value={formData.content}
                                onChange={onEditorChange}
                                placeholder="Start writing your blog post..."
                                minHeight="500px"
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="preview" className="p-0 m-0">
                        <BlogPreview formData={formData} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

export default BlogEditorTabs
