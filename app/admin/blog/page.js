"use client"

import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Search,
    FileText,
    Edit,
    Trash2,
    Plus,
    Calendar,
    User,
    Image as ImageIcon,
    Tag
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/app/components/context/AuthProvider"
import { useRouter } from "next/navigation"

// Mock data for blog posts
const mockBlogPosts = [
    {
        id: "POST-001",
        title: "Digital Marketing Trends for 2025",
        slug: "digital-marketing-trends-2025",
        excerpt: "Discover the emerging digital marketing trends that will shape your strategy in 2025.",
        content: "# Digital Marketing Trends for 2025\n\nThe digital marketing landscape continues to evolve at a rapid pace. As we move into 2025, businesses need to adapt their strategies to stay competitive and effectively reach their target audiences.\n\n## 1. AI-Powered Personalization\n\nArtificial intelligence is revolutionizing how marketers personalize content and offers. In 2025, we'll see even more sophisticated AI tools that can analyze vast amounts of customer data to create hyper-personalized experiences.\n\n## 2. Voice Search Optimization\n\nWith the growing popularity of smart speakers and voice assistants, optimizing for voice search will be essential. This means focusing on natural language queries and creating content that directly answers specific questions.\n\n## 3. Immersive AR/VR Experiences\n\nAugmented reality (AR) and virtual reality (VR) are moving beyond gaming and entertainment into marketing. Brands that create immersive experiences will stand out and drive higher engagement.\n\n## 4. Sustainability Marketing\n\nConsumers are increasingly concerned about environmental issues, leading to the rise of sustainability marketing. Brands that authentically communicate their environmental initiatives will connect more deeply with conscious consumers.\n\n## 5. Privacy-First Marketing\n\nAs privacy regulations tighten and third-party cookies phase out, marketers need to develop strategies that respect user privacy while still delivering personalized experiences through first-party data.\n\n## Conclusion\n\nStaying ahead of these trends will help your business navigate the evolving digital landscape and maintain a competitive edge in 2025 and beyond.",
        featuredImage: "/images/blog1.jpg",
        category: "Digital Marketing",
        tags: ["AI", "Voice Search", "AR/VR", "Sustainability", "Privacy"],
        author: "Admin",
        publishedDate: "2025-04-01T10:30:00",
        status: "published",
        views: 428
    },
    {
        id: "POST-002",
        title: "How to Build a Strong Brand Identity",
        slug: "build-strong-brand-identity",
        excerpt: "Learn how to create a cohesive and compelling brand identity that resonates with your target audience.",
        content: "# How to Build a Strong Brand Identity\n\nA strong brand identity is crucial for standing out in today's crowded marketplace. It helps establish recognition, build trust, and create emotional connections with your audience.\n\n## Understanding Brand Identity\n\nBrand identity encompasses the visible elements of a brand, such as color, design, and logo, that identify and distinguish it in consumers' minds. It's the tangible expression of your brand's personality, values, and promise.\n\n## Key Elements of Brand Identity\n\n### 1. Brand Purpose and Values\n\nClearly define why your brand exists beyond making money. What impact do you want to have? What values drive your business decisions?\n\n### 2. Brand Personality\n\nIs your brand serious or playful? Luxurious or accessible? Define the human characteristics that describe your brand's tone and style.\n\n### 3. Visual Identity\n\nDevelop a cohesive visual system including your logo, color palette, typography, imagery style, and design elements.\n\n### 4. Voice and Messaging\n\nEstablish how your brand communicates across platforms, from the words you use to the tone you adopt.\n\n## Steps to Create a Strong Brand Identity\n\n1. **Research your audience**: Understand their preferences, needs, and values\n2. **Analyze competitors**: Identify how to differentiate your brand\n3. **Define your unique value proposition**: What makes your offering special?\n4. **Develop your visual identity**: Create logos, select colors, and define design principles\n5. **Establish brand guidelines**: Document rules for consistent application\n6. **Implement consistently**: Apply your identity across all touchpoints\n\n## Maintaining Brand Consistency\n\nConsistency is key to building recognition and trust. Create comprehensive brand guidelines and ensure everyone representing your brand understands and follows them.\n\n## Evolving Your Brand\n\nStrong brands evolve over time while maintaining their core identity. Regularly review your brand identity and make thoughtful updates to stay relevant without losing recognition.\n\n## Conclusion\n\nBuilding a strong brand identity requires strategic thinking, creativity, and consistency. When done right, it becomes a powerful asset that drives business growth and creates lasting customer relationships.",
        featuredImage: "/images/blog2.jpg",
        category: "Branding",
        tags: ["Brand Strategy", "Visual Identity", "Brand Guidelines", "Brand Voice"],
        author: "Admin",
        publishedDate: "2025-03-28T14:45:00",
        status: "published",
        views: 356
    },
    {
        id: "POST-003",
        title: "The Power of Content Marketing",
        slug: "power-of-content-marketing",
        excerpt: "Explore how content marketing can drive traffic, build authority, and convert prospects into customers.",
        content: "# The Power of Content Marketing\n\nContent marketing has become a cornerstone of modern marketing strategies. By creating and distributing valuable, relevant content, businesses can attract and engage a clearly defined audience, ultimately driving profitable customer action.\n\n## Why Content Marketing Works\n\nUnlike traditional advertising that interrupts consumers, content marketing provides value before asking for anything in return. This builds trust, establishes authority, and creates a positive brand association.\n\n## Key Benefits of Content Marketing\n\n### 1. Builds Brand Awareness and Recognition\n\nConsistent, high-quality content helps more people become familiar with your brand. The more value you provide, the more likely your audience will remember you.\n\n### 2. Establishes Authority and Expertise\n\nThoughtful, informative content demonstrates your knowledge and positions your brand as an authority in your industry.\n\n### 3. Supports Search Engine Optimization\n\nQuality content that addresses topics your audience searches for improves your search engine rankings, driving organic traffic to your website.\n\n### 4. Nurtures Relationships Throughout the Customer Journey\n\nFrom awareness to consideration to decision, the right content helps move prospects through your sales funnel.\n\n### 5. Generates Qualified Leads\n\nContent tailored to your ideal customer attracts more qualified prospects to your business.\n\n## Creating an Effective Content Marketing Strategy\n\n1. **Define clear objectives**: What do you want your content to achieve?\n2. **Understand your audience**: Create detailed buyer personas to guide content creation\n3. **Audit existing content**: Evaluate what's working and identify gaps\n4. **Plan your content calendar**: Organize topics, formats, and publishing schedule\n5. **Create compelling content**: Focus on quality, relevance, and value\n6. **Distribute strategically**: Share across appropriate channels\n7. **Measure and optimize**: Track performance against objectives\n\n## Content Formats to Consider\n\n- Blog posts and articles\n- Ebooks and whitepapers\n- Infographics and visual content\n- Videos and webinars\n- Podcasts\n- Case studies and testimonials\n- Email newsletters\n- Social media content\n\n## Conclusion\n\nContent marketing is no longer optional for businesses looking to thrive in the digital landscape. By consistently providing valuable content that addresses your audience's needs and challenges, you can build lasting relationships that drive sustainable business growth.",
        featuredImage: "/images/blog3.jpg",
        category: "Content Marketing",
        tags: ["Content Strategy", "SEO", "Lead Generation", "Audience Engagement"],
        author: "Admin",
        publishedDate: "2025-03-25T09:15:00",
        status: "published",
        views: 279
    },
    {
        id: "POST-004",
        title: "Social Media Strategies for B2B Companies",
        slug: "social-media-strategies-b2b",
        excerpt: "Discover effective social media approaches specifically designed for B2B audience engagement and lead generation.",
        content: "# Social Media Strategies for B2B Companies\n\nWhile social media is often associated with B2C marketing, it offers tremendous opportunities for B2B companies when approached strategically. This guide explores how B2B organizations can leverage social platforms to build relationships, establish thought leadership, and generate quality leads.\n\n## LinkedIn: The B2B Powerhouse\n\nLinkedIn remains the most important social platform for B2B marketers. Strategies for maximizing LinkedIn include:\n\n- Optimizing company pages with complete information\n- Sharing industry insights and thought leadership content\n- Leveraging employee advocacy for wider reach\n- Using LinkedIn Groups to establish expertise\n- Implementing targeted advertising campaigns\n\n## Other Valuable Platforms for B2B\n\n### Twitter\n- Engage in industry conversations using relevant hashtags\n- Share timely updates and news\n- Participate in Twitter chats relevant to your industry\n\n### YouTube\n- Create educational content showcasing your expertise\n- Develop case studies and client testimonials\n- Produce product demonstrations and tutorials\n\n### Facebook and Instagram\n- Showcase company culture and values\n- Highlight team members and behind-the-scenes content\n- Share event updates and industry conference participation\n\n## Content Strategies for B2B Social Media\n\n1. **Educational Content**: Provide valuable insights that help your audience solve problems\n2. **Case Studies**: Demonstrate real-world applications and results\n3. **Industry Research and Reports**: Position your company as a knowledge leader\n4. **Employee Spotlights**: Humanize your brand and showcase expertise\n5. **Event Content**: Promote participation in and insights from industry events\n\n## Measuring B2B Social Media Success\n\nTrack these metrics to evaluate your B2B social media effectiveness:\n\n- Website traffic from social channels\n- Lead generation and conversion rates\n- Engagement metrics (shares, comments, saves)\n- Follower growth and quality\n- Share of voice compared to competitors\n\n## Common B2B Social Media Challenges and Solutions\n\n### Challenge: Long Sales Cycles\n**Solution**: Use social media for ongoing nurturing and relationship building through multiple touchpoints\n\n### Challenge: Multiple Decision Makers\n**Solution**: Create content tailored to different stakeholders and their specific concerns\n\n### Challenge: Measuring ROI\n**Solution**: Implement proper tracking from social engagement through to closed deals\n\n## Conclusion\n\nEffective B2B social media marketing requires strategic thinking, consistent execution, and patience. By focusing on providing value to your professional audience and building meaningful relationships, B2B companies can achieve significant results through social channels.",
        featuredImage: "/images/blog4.jpg",
        category: "Social Media",
        tags: ["LinkedIn", "B2B Marketing", "Thought Leadership", "Lead Generation"],
        author: "Admin",
        publishedDate: "2025-03-20T11:30:00",
        status: "draft",
        views: 0
    },
    {
        id: "POST-005",
        title: "Email Marketing Best Practices for 2025",
        slug: "email-marketing-best-practices-2025",
        excerpt: "Stay ahead of the curve with these cutting-edge email marketing strategies for 2025 and beyond.",
        content: "# Email Marketing Best Practices for 2025\n\n*Draft content in progress...*",
        featuredImage: "/images/blog5.jpg",
        category: "Email Marketing",
        tags: ["Email Automation", "Personalization", "Deliverability"],
        author: "Admin",
        publishedDate: null,
        status: "draft",
        views: 0
    }
]

// Categories
const categories = [
    "Digital Marketing",
    "Branding",
    "Content Marketing",
    "Social Media",
    "Email Marketing",
    "SEO",
    "PPC",
    "Analytics"
]

export default function AdminBlog() {
    const [blogPosts, setBlogPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [editingPost, setEditingPost] = useState(null)
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [isNewPost, setIsNewPost] = useState(false)
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        featuredImage: "",
        category: "",
        tags: "",
        status: "draft"
    })

    const { user, isAuthenticated, loading } = useAuth()
    const router = useRouter()

    // Fetch blog posts (simulated)
    useEffect(() => {
        // Redirect if not authenticated
        // if (!loading && !isAuthenticated) {
        //     router.push('/login')
        //     return
        // }

        const fetchBlogPosts = async () => {
            setIsLoading(true)
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800))
                setBlogPosts(mockBlogPosts)
                setFilteredPosts(mockBlogPosts)
            } catch (error) {
                console.error('Failed to fetch blog posts:', error)
            } finally {
                setIsLoading(false)
            }
        }

        // if (isAuthenticated) {
        //     fetchBlogPosts()
        // }
        fetchBlogPosts()
    }, [isAuthenticated, loading, router])

    // Handle filtering and searching
    useEffect(() => {
        let result = [...blogPosts]

        // Apply status filter
        if (statusFilter !== "all") {
            result = result.filter(post => post.status === statusFilter)
        }

        // Apply category filter
        if (categoryFilter !== "all") {
            result = result.filter(post => post.category === categoryFilter)
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(post =>
                post.title.toLowerCase().includes(term) ||
                post.excerpt.toLowerCase().includes(term) ||
                post.content.toLowerCase().includes(term) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term)))
            )
        }

        setFilteredPosts(result)
    }, [blogPosts, statusFilter, categoryFilter, searchTerm])

    // Handle edit post
    const handleEditPost = (post) => {
        setEditingPost(post)
        setIsNewPost(false)
        setFormData({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            featuredImage: post.featuredImage,
            category: post.category,
            tags: post.tags ? post.tags.join(", ") : "",
            status: post.status
        })
        setIsEditorOpen(true)
    }

    // Handle new post
    const handleNewPost = () => {
        setEditingPost(null)
        setIsNewPost(true)
        setFormData({
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            featuredImage: "",
            category: categories[0],
            tags: "",
            status: "draft"
        })
        setIsEditorOpen(true)
    }

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Auto-generate slug from title if it's a new post
        if (name === 'title' && isNewPost) {
            const slug = value
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/\s+/g, '-')

            setFormData(prev => ({
                ...prev,
                slug
            }))
        }
    }

    // Handle save post
    const handleSavePost = async () => {
        if (!formData.title || !formData.content) {
            // Show validation error (you could use toast here)
            console.error("Title and content are required")
            return
        }

        setIsSubmitting(true)

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Process tags from comma-separated string to array
            const processedTags = formData.tags
                ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                : []

            if (isNewPost) {
                // Create new post
                const newPost = {
                    id: `POST-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
                    ...formData,
                    tags: processedTags,
                    author: "Admin",
                    publishedDate: formData.status === 'published' ? new Date().toISOString() : null,
                    views: 0
                }

                setBlogPosts(prev => [newPost, ...prev])
            } else {
                // Update existing post
                const updatedPosts = blogPosts.map(post => {
                    if (post.id === editingPost.id) {
                        return {
                            ...post,
                            ...formData,
                            tags: processedTags,
                            publishedDate: formData.status === 'published' && !post.publishedDate
                                ? new Date().toISOString()
                                : post.publishedDate
                        }
                    }
                    return post
                })

                setBlogPosts(updatedPosts)
            }

            // Close editor
            setIsEditorOpen(false)

            // Show success message (you could use toast here)
            console.log(`Post ${isNewPost ? 'created' : 'updated'} successfully!`)
        } catch (error) {
            console.error(`Failed to ${isNewPost ? 'create' : 'update'} post:`, error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle delete post
    const handleDeletePost = async (id) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))

            // Remove post from state
            setBlogPosts(prev => prev.filter(post => post.id !== id))

            // Close confirmation dialog
            setConfirmDeleteId(null)

            // Show success message (you could use toast here)
            console.log("Post deleted successfully!")
        } catch (error) {
            console.error("Failed to delete post:", error)
        }
    }

    // Handle publish/unpublish post
    const handleStatusChange = async (id, newStatus) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))

            // Update post status in state
            const updatedPosts = blogPosts.map(post => {
                if (post.id === id) {
                    return {
                        ...post,
                        status: newStatus,
                        publishedDate: newStatus === 'published' && !post.publishedDate
                            ? new Date().toISOString()
                            : post.publishedDate
                    }
                }
                return post
            })

            setBlogPosts(updatedPosts)

            // Show success message (you could use toast here)
            console.log(`Post ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`)
        } catch (error) {
            console.error(`Failed to ${newStatus === 'published' ? 'publish' : 'unpublish'} post:`, error)
        }
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "Not published"

        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
                    <p className="text-muted-foreground">Create and manage your blog content</p>
                </div>
                <Button onClick={handleNewPost} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>New Post</span>
                </Button>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search blog posts..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                            <div className="flex items-center gap-2">
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select
                                    value={categoryFilter}
                                    onValueChange={setCategoryFilter}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map(category => (
                                            <SelectItem key={category} value={category}>{category}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Blog Posts Grid */}
            <div>
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No blog posts found</p>
                        {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
                            <Button
                                variant="link"
                                onClick={() => {
                                    setSearchTerm("")
                                    setStatusFilter("all")
                                    setCategoryFilter("all")
                                }}
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <Card key={post.id} className="overflow-hidden flex flex-col h-full">
                                <div className="relative aspect-video bg-gray-100">
                                    {/* Replace with actual image component in production */}
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <ImageIcon className="h-10 w-10" />
                                    </div>
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
                                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                                        <Tag className="h-3 w-3" />
                                        <span>{post.category}</span>
                                    </div>
                                    <CardTitle className="line-clamp-2 h-14">{post.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500 line-clamp-3 h-[4.5rem]">{post.excerpt}</p>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-4">
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatDate(post.publishedDate)}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t pt-4 mt-auto">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <User className="h-3 w-3" />
                                        <span>{post.author}</span>
                                        {post.status === 'published' && (
                                            <>
                                                <span className="mx-1">•</span>
                                                <span>{post.views} views</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEditPost(post)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500"
                                            onClick={() => setConfirmDeleteId(post.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Post Editor Dialog */}
            <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
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

                    <Tabs defaultValue="content" className="w-full">
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
                                        onChange={handleInputChange}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="excerpt">Excerpt</Label>
                                    <Textarea
                                        id="excerpt"
                                        name="excerpt"
                                        placeholder="Brief summary of the post"
                                        value={formData.excerpt}
                                        onChange={handleInputChange}
                                        className="mt-1 h-20"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        name="content"
                                        placeholder="Write your post content here... (Markdown supported)"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        className="mt-1 h-64 font-mono"
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
                                        onChange={handleInputChange}
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
                                                <SelectItem key={category} value={category}>{category}</SelectItem>
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
                                    onChange={handleInputChange}
                                    className="mt-1"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Example: marketing, social media, branding
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="featuredImage">Featured Image URL</Label>
                                <Input
                                    id="featuredImage"
                                    name="featuredImage"
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.featuredImage}
                                    onChange={handleInputChange}
                                    className="mt-1"
                                />
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

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSavePost}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save Post"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this blog post? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleDeletePost(confirmDeleteId)}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
