'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Calendar,
    Search,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Bookmark,
    Clock,
    Loader,
    TrendingUp,
    MessageSquare,
    Share2,
    Users,
    Menu,
    X
} from 'lucide-react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(3);
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Refs for GSAP animations
    const headerRef = useRef(null);
    const searchRef = useRef(null);
    const gridRef = useRef(null);
    const sidebarRef = useRef(null);
    const blogRefs = useRef([]);

    // Blog categories with icons
    const blogCategories = [
        { label: "Digital Marketing Strategies", href: "/blogs/digital-marketing", icon: <TrendingUp className="h-4 w-4 mr-2" /> },
        { label: "Content Marketing Strategies", href: "/blogs/content-marketing", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
        { label: "Social Media Strategies", href: "/blogs/social-media", icon: <Share2 className="h-4 w-4 mr-2" /> },
        { label: "Sales Strategies", href: "/blogs/sales-strategies", icon: <Users className="h-4 w-4 mr-2" /> },
    ];

    // Updated blog data focused on marketing and sales
    const sampleBlogs = [
        // Page 1
        [
            {
                id: 1,
                title: 'Digital Marketing Trends for 2025',
                image: '/images/blog1.jpg',
                excerpt: 'Discover the emerging digital marketing trends that will shape your strategy in 2025.',
                date: 'March 15, 2025',
                readTime: '5 min read',
                category: 'Digital Marketing'
            },
            {
                id: 2,
                title: 'Content That Converts: B2B Guide',
                image: '/images/blog2.jpg',
                excerpt: 'Learn how to create content that drives meaningful conversions for your B2B audience.',
                date: 'March 12, 2025',
                readTime: '7 min read',
                category: 'Content Marketing'
            },
            {
                id: 3,
                title: 'Social Media Algorithms in 2025',
                image: '/images/blog3.jpg',
                excerpt: 'Understanding how social platforms prioritize content and how to optimize your strategy.',
                date: 'March 10, 2025',
                readTime: '6 min read',
                category: 'Social Media'
            },
            {
                id: 4,
                title: 'Sales Funnel Optimization Tactics',
                image: '/images/blog4.jpg',
                excerpt: 'Practical strategies to improve conversion rates at every stage of your sales funnel.',
                date: 'March 5, 2025',
                readTime: '8 min read',
                category: 'Sales'
            }
        ],
        // Page 2
        [
            {
                id: 5,
                title: 'SEO Strategies for E-commerce',
                image: '/images/blog5.jpg',
                excerpt: 'Advanced SEO techniques specifically designed to boost e-commerce performance.',
                date: 'March 1, 2025',
                readTime: '10 min read',
                category: 'Digital Marketing'
            },
            {
                id: 6,
                title: 'Storytelling in B2B Content',
                image: '/images/blog6.jpg',
                excerpt: 'How to use narrative techniques to make your B2B content more engaging and persuasive.',
                date: 'February 25, 2025',
                readTime: '9 min read',
                category: 'Content Marketing'
            },
            {
                id: 7,
                title: 'Building Communities on Social',
                image: '/images/blog7.jpg',
                excerpt: 'Step-by-step guide to creating engaged social media communities around your brand.',
                date: 'February 20, 2025',
                readTime: '11 min read',
                category: 'Social Media'
            },
            {
                id: 8,
                title: 'Sales Objection Handling',
                image: '/images/blog8.jpg',
                excerpt: 'Proven techniques to address and overcome common sales objections effectively.',
                date: 'February 15, 2025',
                readTime: '12 min read',
                category: 'Sales'
            }
        ],
        // Page 3
        [
            {
                id: 9,
                title: 'AI-Powered Marketing Automation',
                image: '/images/blog9.jpg',
                excerpt: 'How artificial intelligence is transforming marketing automation and personalization.',
                date: 'February 10, 2025',
                readTime: '8 min read',
                category: 'Digital Marketing'
            },
            {
                id: 10,
                title: 'Content ROI Measurement',
                image: '/images/blog10.jpg',
                excerpt: 'Frameworks and metrics to accurately measure the return on your content investments.',
                date: 'February 5, 2025',
                readTime: '11 min read',
                category: 'Content Marketing'
            },
            {
                id: 11,
                title: 'Video Marketing on Social Platforms',
                image: '/images/blog11.jpg',
                excerpt: 'Best practices for creating effective video content across different social networks.',
                date: 'February 1, 2025',
                readTime: '9 min read',
                category: 'Social Media'
            },
            {
                id: 12,
                title: 'Value-Based Selling Techniques',
                image: '/images/blog12.jpg',
                excerpt: 'How to shift from feature-based selling to a value-focused approach that resonates with buyers.',
                date: 'January 28, 2025',
                readTime: '7 min read',
                category: 'Sales'
            }
        ]
    ];

    // Initialize GSAP animations
    useEffect(() => {
        if (!loading && blogs.length > 0) {
            // Header animation
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );

            // Search bar animation
            gsap.fromTo(searchRef.current,
                { opacity: 0, width: '80%' },
                { opacity: 1, width: '100%', duration: 0.6, delay: 0.3, ease: "back.out(1.7)" }
            );

            // Blog cards staggered animation
            gsap.fromTo(blogRefs.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: 0.2
                }
            );

            // Sidebar animation
            if (window.innerWidth > 768 && sidebarRef.current) {
                gsap.fromTo(sidebarRef.current,
                    { opacity: 0, x: 30 },
                    { opacity: 1, x: 0, duration: 0.8, delay: 0.4, ease: "power2.out" }
                );
            }

            // Set up scroll animations for blog cards
            blogRefs.current.forEach((blog) => {
                ScrollTrigger.create({
                    trigger: blog,
                    start: "top bottom-=100",
                    onEnter: () => {
                        gsap.to(blog, {
                            scale: 1.02,
                            duration: 0.3,
                            ease: "power1.out",
                            overwrite: "auto"
                        });
                        gsap.to(blog, {
                            scale: 1,
                            duration: 0.5,
                            delay: 0.3,
                            ease: "elastic.out(1, 0.3)",
                            overwrite: "auto"
                        });
                    },
                    once: true
                });
            });
        }

        // Clean up
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [loading, blogs]);

    // Handle resize event for responsive sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Simulated API call with setTimeout to mimic network delay
        const fetchBlogs = async () => {
            try {
                setLoading(true);

                // Reset refs array for new page
                blogRefs.current = [];

                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 800));

                // Filter blogs by search term if needed
                const pageData = sampleBlogs[currentPage - 1] || [];
                const filteredBlogs = searchTerm
                    ? pageData.filter(blog =>
                        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        blog.category.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    : pageData;

                // Update state with the filtered data
                setBlogs(filteredBlogs);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch blogs. Please try again later.');
                setLoading(false);
                console.error('Error fetching blogs:', err);
            }
        };

        fetchBlogs();
    }, [currentPage, searchTerm]); // Re-fetch when page or search changes

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;

        // Page transition animation
        if (gridRef.current) {
            gsap.to(gridRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    setCurrentPage(page);
                    // Scroll to top when changing pages
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        } else {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Animation variants for framer motion
    const loaderVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    // Sidebar animation variants
    const sidebarVariants = {
        closed: {
            x: "100%",
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        open: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    // Add a blog ref for GSAP animations
    const addBlogRef = (el) => {
        if (el && !blogRefs.current.includes(el)) {
            blogRefs.current.push(el);
        }
    };

    // Handle search input with debounce
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center p-4 bg-white border-b border-gray-200 sticky top-0 z-10 gap-5">
                <button
                    className="p-2 rounded-md hover:bg-gray-100"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
                <h1 className="text-xl font-bold text-gray-800">Marketing & Sales Blog</h1>
            </div>

            <div className="flex flex-col md:flex-row">
                {/* Main content area */}
                <div className="w-full md:w-3/4 p-4 md:p-6">
                    <div className="hidden md:flex justify-between items-center mb-8">
                        <h1
                            ref={headerRef}
                            className="text-2xl md:text-3xl font-bold text-gray-800"
                        >
                            Marketing & Sales Insights
                        </h1>
                    </div>

                    {/* Search bar */}
                    <div
                        ref={searchRef}
                        className="relative mb-6 md:hidden flex"
                    >
                        <input
                            type="text"
                            placeholder="Search marketing & sales blogs..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                className="flex flex-col justify-center items-center h-64"
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    variants={loaderVariants}
                                    animate="animate"
                                    className="text-blue-500 mb-4"
                                >
                                    <Loader size={30} />
                                </motion.div>
                                <p className="text-gray-600">Loading blogs...</p>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                className="text-red-500 text-center h-64 flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {error}
                            </motion.div>
                        ) : blogs.length === 0 ? (
                            <motion.div
                                className="text-gray-500 text-center h-64 flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                No blogs found matching your search criteria.
                            </motion.div>
                        ) : (
                            <div
                                ref={gridRef}
                                key={`page-${currentPage}-${searchTerm}`}
                            >
                                {/* Blog grid - responsive */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                                    {blogs.map((blog) => (
                                        <div
                                            key={blog.id}
                                            ref={addBlogRef}
                                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
                                        >
                                            <div className="h-40 bg-gray-200 relative overflow-hidden">
                                                {/* This is a placeholder for the image */}
                                                <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gradient-to-r from-gray-200 to-gray-300">
                                                    Image Placeholder
                                                </div>
                                                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                                                    {blog.category}
                                                </div>
                                            </div>
                                            <div className="p-4 flex flex-col flex-grow">
                                                <div className="flex items-center text-xs text-gray-500 mb-2">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    <span className="mr-3">{blog.date}</span>
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    <span>{blog.readTime}</span>
                                                </div>
                                                <h3 className="font-bold text-lg mb-2 text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">{blog.title}</h3>
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{blog.excerpt}</p>
                                                <button
                                                    className="text-blue-500 text-sm font-medium flex items-center group mt-auto"
                                                    onMouseEnter={(e) => {
                                                        gsap.to(e.currentTarget, {
                                                            x: 5,
                                                            duration: 0.3,
                                                            ease: "power2.out"
                                                        });
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        gsap.to(e.currentTarget, {
                                                            x: 0,
                                                            duration: 0.3,
                                                            ease: "power2.out"
                                                        });
                                                    }}
                                                >
                                                    Read more <ArrowRight className="h-3 w-3 ml-1 group-hover:ml-2 transition-all duration-300" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination - responsive */}
                                <div className="flex justify-center items-center mt-8 md:mt-10">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`mx-1 p-2 rounded-full ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'} transition-colors duration-300`}
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    {Array.from({ length: totalPages }).map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`mx-1 w-8 h-8 rounded-full flex items-center justify-center ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'} transition-all duration-300`}
                                            aria-label={`Page ${index + 1}`}
                                            aria-current={currentPage === index + 1 ? "page" : undefined}
                                            onMouseEnter={(e) => {
                                                if (currentPage !== index + 1) {
                                                    gsap.to(e.currentTarget, {
                                                        scale: 1.1,
                                                        duration: 0.3,
                                                        ease: "back.out(1.7)"
                                                    });
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (currentPage !== index + 1) {
                                                    gsap.to(e.currentTarget, {
                                                        scale: 1,
                                                        duration: 0.3,
                                                        ease: "power2.out"
                                                    });
                                                }
                                            }}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`mx-1 p-2 rounded-full ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'} transition-colors duration-300`}
                                        aria-label="Next page"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Desktop Sidebar */}
                <div
                    ref={sidebarRef}
                    className="hidden md:block w-1/4 p-6 border-l border-gray-200"
                >
                    <div className="sticky top-6">
                        <div>
                            <div
                                ref={searchRef}
                                className="relative mb-6 hidden md:flex"
                            >
                                <input
                                    type="text"
                                    placeholder="Search marketing & sales blogs..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                />
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            </div>
                            <div className="flex items-center mb-4">
                                <Bookmark className="h-5 w-5 text-blue-500 mr-2" />
                                <h2 className="text-lg font-bold text-gray-800">Categories</h2>
                            </div>
                            <ul className="space-y-2">
                                {blogCategories.map((category, index) => (
                                    <li
                                        key={index}
                                        className="transition-transform duration-300"
                                        onMouseEnter={(e) => {
                                            gsap.to(e.currentTarget, {
                                                x: 5,
                                                duration: 0.3,
                                                ease: "power2.out"
                                            });
                                        }}
                                        onMouseLeave={(e) => {
                                            gsap.to(e.currentTarget, {
                                                x: 0,
                                                duration: 0.3,
                                                ease: "power2.out"
                                            });
                                        }}
                                    >
                                        <a
                                            href={category.href}
                                            className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
                                        >
                                            {category.icon}
                                            {category.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Mobile Sidebar (slide in from right) */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            className="fixed inset-0 bg-black/25 bg-opacity-50 z-20 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <motion.div
                                className="absolute right-0 top-0 h-full w-64 bg-white p-4 overflow-y-auto"
                                variants={sidebarVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Menu</h2>
                                    <button
                                        className="p-1 rounded-md hover:bg-gray-100"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center mb-3">
                                        <Bookmark className="h-5 w-5 text-blue-500 mr-2" />
                                        <h2 className="text-lg font-bold text-gray-800">Categories</h2>
                                    </div>
                                    <ul className="space-y-3">
                                        {blogCategories.map((category, index) => (
                                            <li key={index}>
                                                <a
                                                    href={category.href}
                                                    className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
                                                >
                                                    {category.icon}
                                                    {category.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Blogs;