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

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));

                // In a real app, you would fetch from your API
                // const response = await fetch(`/api/blogs/${params.id}`);
                // const data = await response.json();

                // For now, get from localStorage
                const storedBlogs = JSON.parse(localStorage.getItem('blogPosts') || '[]');

                // Find post by ID
                const postData = storedBlogs.find(post => post.id === params.id);

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