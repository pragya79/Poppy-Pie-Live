// app/admin/blog/edit/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CreateBlogPage from "@/app/components/Admin/CreateBlogPage";

export default function EditBlogPage() {
    const params = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // In a real app, you would fetch the post data from your API
        const fetchPost = async () => {
            try {
                setLoading(true);

                // Simulating API call with mock data
                // This should be replaced with your actual API call
                await new Promise(resolve => setTimeout(resolve, 800));

                // Mock data retrieval - replace with your data access logic
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
                    // Other blog posts would be here
                ];

                // Find the post that matches the ID from the URL
                const postData = mockBlogPosts.find(post => post.id === params.id);

                if (!postData) {
                    throw new Error("Post not found");
                }

                setPost(postData);
            } catch (error) {
                console.error("Failed to fetch post:", error);
                setError(error.message || "Failed to load post data");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchPost();
        } else {
            setError("No post ID provided");
            setLoading(false);
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-gray-700 mb-6">{error}</p>
                <button
                    onClick={() => router.push('/admin/blog')}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Back to Blog Posts
                </button>
            </div>
        );
    }

    return <CreateBlogPage editMode={true} postData={post} />;
}