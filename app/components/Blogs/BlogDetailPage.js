'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import {
    Clock,
    Calendar,
    Tag,
    ArrowLeft,
    Share2,
    Bookmark,
    MessageSquare,
    ChevronUp,
    Eye,
    Heart,
    Twitter,
    Facebook,
    Linkedin
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { mockBlogPosts } from './MockDataSet';

const BlogDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

    // Parallax header effect - adjust based on screen size
    const headerRef = useRef(null);
    const { scrollY } = useScroll();
    const headerY = useTransform(scrollY, [0, 300], [0, windowWidth < 768 ? 50 : 100]);
    const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.6]);

    // Content reveal animation on scroll
    const contentRef = useRef(null);

    // Track window resize for responsive adjustments
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch blog post data
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);

                // In a real app, this would be an API call
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network request

                // For now, get from localStorage
                const storedBlogs = JSON.parse(localStorage.getItem('blogPosts') || '[]');

                // Find post by ID (convert to number if necessary)
                const blogPost = storedBlogs.find(post => post.id === params.id || post.id === parseInt(params.id));

                if (!blogPost) {
                    throw new Error("Blog post not found");
                }

                // Update view count
                if (blogPost.status === 'published') {
                    blogPost.views = (blogPost.views || 0) + 1;

                    // Update in storage
                    const updatedBlogs = storedBlogs.map(post =>
                        post.id === blogPost.id ? blogPost : post
                    );
                    localStorage.setItem('blogPosts', JSON.stringify(updatedBlogs));
                }

                setPost(blogPost);
            } catch (err) {
                console.error("Failed to fetch post:", err);
                setError(err.message || "Failed to load blog post");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchPost();
        } else {
            setError("No blog ID provided");
            setLoading(false);
        }
    }, [params.id]);

    // Track scroll progress
    const { scrollYProgress } = useScroll();

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Renders markdown content with basic formatting
    const renderMarkdownContent = (content) => {
        return { __html: content };
    };

    // Handle like and bookmark
    const handleLike = () => {
        setLiked(!liked);
    };

    const handleBookmark = () => {
        setBookmarked(!bookmarked);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-t-4 border-b-4 border-blue-600 border-solid rounded-full animate-spin mb-4"></div>
                    <p className="text-sm sm:text-base text-gray-600 animate-pulse">Loading article...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 sm:py-16 text-center">
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6 sm:p-8">
                    <div className="text-red-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">Error Loading Article</h1>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/blogs')}
                        className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base"
                    >
                        Back to Blogs
                    </button>
                </div>
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="bg-gray-50 min-h-screen overflow-x-hidden">
            {/* Reading progress bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gray-900 origin-left z-50"
                style={{ scaleX: scrollYProgress }}
            />

            {/* Back to top button - adjusted for better mobile positioning */}
            <AnimatedScrollButton show={showScrollTop} onClick={scrollToTop} />

            {/* Hero header with responsive parallax effect */}
            <motion.header
                ref={headerRef}
                className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] bg-gray-900 text-white overflow-hidden"
                style={{
                    y: headerY,
                    opacity: headerOpacity
                }}
            >
                <div className="absolute inset-0">
                    {post.featuredImage ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={post.featuredImage}
                                alt={post.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                                priority
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gray-900" />
                    )}
                </div>

                <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 sm:pb-12 md:pb-16 relative z-10">
                    <div className="max-w-4xl mx-auto w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-4 sm:mb-6"
                        >
                            <Link
                                href="/blogs"
                                className="inline-flex items-center text-xs sm:text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white hover:bg-white/20 transition-colors"
                            >
                                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                                Back to Blogs
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-4 tracking-tight">{post.title}</h1>

                            {post.excerpt && (
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-3xl mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-none">
                                    {post.excerpt}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-300">
                                <span className="flex items-center mr-4 sm:mr-6 mb-2">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-gray-400" />
                                    {post.date}
                                </span>
                                <span className="flex items-center mr-4 sm:mr-6 mb-2">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-gray-400" />
                                    {post.readTime}
                                </span>
                                <span className="flex items-center mr-4 sm:mr-6 mb-2">
                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-gray-400" />
                                    {post.views || 0} views
                                </span>
                                <motion.span
                                    className="flex items-center mb-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gray-800/20 backdrop-blur-sm"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                                    {post.category}
                                </motion.span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.header>

            {/* Main content - improved margins for mobile */}
            <main className="relative -mt-6 sm:-mt-10 md:-mt-16 container mx-auto px-4 z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Article content card */}
                    <motion.article
                        ref={contentRef}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white shadow-xl rounded-xl overflow-hidden mb-8 sm:mb-12"
                    >
                        {/* Author bar - top of content */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
                            <div className="flex items-center">
                                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium mr-3">
                                    {post.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-xs sm:text-sm md:text-base text-gray-900">{post.author}</p>
                                    <p className="text-xs text-gray-500">Published on {post.date}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                            <div className="prose prose-xs sm:prose-sm md:prose-base lg:prose-lg max-w-none prose-headings:text-gray-800 prose-a:text-gray-700 prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto">
                                <div dangerouslySetInnerHTML={renderMarkdownContent(post.content)} />
                            </div>
                        </div>

                        {/* Tags and reactions */}
                        <div className="px-4 sm:px-6 md:px-8 lg:px-10 pb-4 sm:pb-6 md:pb-8 lg:pb-10 pt-2">
                            {post.tags && post.tags.length > 0 && (
                                <div className="mb-4 sm:mb-6">
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {post.tags.map((tag, index) => (
                                            <motion.span
                                                key={index}
                                                className="inline-block bg-gray-100 rounded-full px-2.5 py-1 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {tag}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.article>

                    {/* Related posts section with improved responsive grid */}
                    <RelatedPosts post={post} mockBlogPosts={mockBlogPosts} />

                    {/* Enhanced subscribe section with better mobile padding */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="bg-gray-900 text-white rounded-xl shadow-xl p-6 sm:p-8 md:p-10 mb-8 sm:mb-16 overflow-hidden relative"
                    >
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-32 sm:w-64 h-32 sm:h-64 rounded-full bg-gray-800 filter blur-3xl"></div>
                            <div className="absolute bottom-0 right-0 w-32 sm:w-64 h-32 sm:h-64 rounded-full bg-gray-700 filter blur-3xl"></div>
                        </div>

                        <div className="relative z-10 text-center max-w-lg mx-auto">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">Enjoyed this article?</h3>
                                <p className="mb-4 sm:mb-6 text-xs sm:text-sm md:text-base text-gray-200">Subscribe to our newsletter to get the latest insights on digital marketing and branding.</p>
                            </motion.div>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto"
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="flex-grow px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-inner bg-white border border-gray-300 text-sm"
                                />
                                <motion.button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-colors shadow-lg font-medium text-sm sm:text-base"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Subscribe
                                </motion.button>
                            </motion.div>

                            <p className="text-xs text-gray-300 mt-3 sm:mt-4">We respect your privacy. Unsubscribe at any time.</p>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

// Animated scroll-to-top button - adjusted position for mobile
const AnimatedScrollButton = ({ show, onClick }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-gray-900 text-white p-2 sm:p-3 rounded-full shadow-lg z-50"
                    onClick={onClick}
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

// Related posts component with responsive improvements
const RelatedPosts = ({ post, mockBlogPosts }) => {
    const relatedPosts = mockBlogPosts
        .filter(relatedPost => relatedPost.id !== post.id && relatedPost.category === post.category)
        .slice(0, 2);

    if (relatedPosts.length === 0) return null;

    return (
        <motion.div
            className="mb-8 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
        >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-8 pb-2 border-b border-gray-200">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                {relatedPosts.map(relatedPost => (
                    <Link key={relatedPost.id} href={`/blogs/${relatedPost.id}`}>
                        <motion.div
                            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                            whileHover={{ y: -5, scale: 1.01 }}
                        >
                            <div className="h-40 sm:h-48 md:h-56 lg:h-60 relative overflow-hidden">
                                <Image
                                    src={relatedPost.image || '/placeholder.svg'}
                                    alt={relatedPost.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <span className="text-xs font-medium bg-gray-800/80 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                                        {relatedPost.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 sm:p-5">
                                <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 group-hover:text-gray-900 transition-colors line-clamp-2">{relatedPost.title}</h3>
                                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{relatedPost.excerpt}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {relatedPost.date}
                                    </span>
                                    <span className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {relatedPost.readTime}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
};

export default BlogDetailPage;