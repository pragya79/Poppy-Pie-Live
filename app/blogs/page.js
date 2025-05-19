'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion';
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
import Link from 'next/link';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(3);
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Framer Motion animation controls
    const headerControls = useAnimation();
    const searchControls = useAnimation();
    const sidebarControls = useAnimation();

    // Refs for animations
    const headerRef = useRef(null);
    const searchRef = useRef(null);
    const gridRef = useRef(null);
    const sidebarRef = useRef(null);

    // Use inView hook from Framer Motion to trigger animations
    const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 });
    const isSearchInView = useInView(searchRef, { once: true, amount: 0.5 });
    const isSidebarInView = useInView(sidebarRef, { once: true, amount: 0.3 });

    // Blog categories with icons
    const blogCategories = [
        { label: "Digital Marketing Strategies", href: "/blogs/digital-marketing", icon: <TrendingUp className="h-4 w-4 mr-2" /> },
        { label: "Content Marketing Strategies", href: "/blogs/content-marketing", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
        { label: "Social Media Strategies", href: "/blogs/social-media", icon: <Share2 className="h-4 w-4 mr-2" /> },
        { label: "Sales Strategies", href: "/blogs/sales-strategies", icon: <Users className="h-4 w-4 mr-2" /> },
    ];

    // Trigger animations when elements are in view
    useEffect(() => {
        if (isHeaderInView) {
            headerControls.start({ opacity: 1, y: 0 });
        }
    }, [isHeaderInView, headerControls]);

    useEffect(() => {
        if (isSearchInView) {
            searchControls.start({ opacity: 1, width: '100%' });
        }
    }, [isSearchInView, searchControls]);

    useEffect(() => {
        if (isSidebarInView) {
            sidebarControls.start({ opacity: 1, x: 0 });
        }
    }, [isSidebarInView, sidebarControls]);

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

    // Fetch blogs
    useEffect(() => {
        // Simulated API call with setTimeout to mimic network delay
        const fetchBlogs = async () => {
            try {
                setLoading(true);

                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 800));

                // For now, get from localStorage
                const storedBlogs = JSON.parse(localStorage.getItem('blogPosts') || '[]');

                // Only show published blogs
                const publishedBlogs = storedBlogs.filter(blog => blog.status === 'published');

                // Sort by date (newest first)
                publishedBlogs.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

                // Paginate the blogs
                const pageData = chunk(publishedBlogs, 4)[currentPage - 1] || [];

                // Set total pages
                setTotalPages(Math.ceil(publishedBlogs.length / 4) || 1);

                // Filter blogs by search term if needed
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
    }, [currentPage, searchTerm]);

    // Helper function to chunk array into groups
    function chunk(array, size) {
        if (!array || !array.length) return [];
        const chunked = [];
        for (let i = 0; i < array.length; i += size) {
            chunked.push(array.slice(i, i + size));
        }
        return chunked;
    }

    // Handle page change
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle search input
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    // Animation variants for elements
    const headerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const searchVariants = {
        hidden: { opacity: 0, width: '80%' },
        visible: {
            opacity: 1,
            width: '100%',
            transition: {
                duration: 0.6,
                delay: 0.3,
                ease: [0.175, 0.885, 0.32, 1.275] // This is similar to the "back.out(1.7)" in GSAP
            }
        }
    };

    const sidebarVariants = {
        hidden: { opacity: 0, x: 30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                delay: 0.4,
                ease: "easeOut"
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

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
    const mobileSidebarVariants = {
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

    // Grid page change transition
    const pageTransitionVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center p-4 bg-white border-b border-gray-200 sticky top-0 z-10 gap-5">
                <motion.button
                    className="p-2 rounded-md hover:bg-gray-100"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    whileTap={{ scale: 0.95 }}
                >
                    {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.button>
                <motion.h1
                    className="text-xl font-bold text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Marketing & Sales Blog
                </motion.h1>
            </div>

            <div className="flex flex-col md:flex-row">
                {/* Main content area */}
                <div className="w-full md:w-3/4 p-4 md:p-6">
                    <div className="hidden md:flex justify-between items-center mb-8">
                        <motion.h1
                            ref={headerRef}
                            initial="hidden"
                            animate={isHeaderInView ? "visible" : "hidden"}
                            variants={headerVariants}
                            className="text-2xl md:text-3xl font-bold text-gray-800"
                        >
                            Marketing & Sales Insights
                        </motion.h1>
                    </div>

                    {/* Search bar */}
                    <motion.div
                        ref={searchRef}
                        className="relative mb-6 md:hidden flex"
                        initial="hidden"
                        animate={isSearchInView ? "visible" : "hidden"}
                        variants={searchVariants}
                    >
                        <input
                            type="text"
                            placeholder="Search marketing & sales blogs..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                className="flex flex-col justify-center items-center h-64"
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
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
                                transition={{ duration: 0.4 }}
                            >
                                {error}
                            </motion.div>
                        ) : blogs.length === 0 ? (
                            <motion.div
                                className="text-gray-500 text-center h-64 flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                No blogs found matching your search criteria.
                            </motion.div>
                        ) : (
                            <motion.div
                                ref={gridRef}
                                key={`page-${currentPage}-${searchTerm}`}
                                variants={pageTransitionVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                {/* Blog grid - responsive */}
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {blogs.map((blog, index) => (
                                        <motion.div
                                            key={blog.id}
                                            variants={itemVariants}
                                            custom={index}
                                            whileHover={{
                                                y: -5,
                                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                            }}
                                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
                                        >
                                            <div className="relative overflow-hidden aspect-video">
                                                {/* This is a placeholder for the image */}
                                                <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gradient-to-r from-gray-200 to-gray-300">
                                                    Image Placeholder
                                                </div>
                                                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                                                    {blog.category}
                                                </div>
                                            </div>
                                            <div className="p-5 flex flex-col flex-grow">
                                                <div className="flex items-center text-xs text-gray-500 mb-3">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    <span className="mr-3">{blog.date}</span>
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    <span>{blog.readTime}</span>
                                                </div>
                                                <h3 className="font-bold text-lg mb-3 text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">{blog.title}</h3>
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{blog.excerpt}</p>
                                                <Link href={`/blogs/${blog.id}`} className="mt-auto">
                                                    <motion.button
                                                        className="text-blue-500 text-sm font-medium flex items-center group mt-auto"
                                                        whileHover={{ x: 5 }}
                                                        whileTap={{ scale: 0.97 }}
                                                    >
                                                        Read more <ArrowRight className="h-3 w-3 ml-1 group-hover:ml-2 transition-all duration-300" />
                                                    </motion.button>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Pagination - responsive */}
                                <div className="flex justify-center items-center mt-8 md:mt-10">
                                    <motion.button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`mx-1 p-2 rounded-full ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'} transition-colors duration-300`}
                                        aria-label="Previous page"
                                        whileHover={currentPage !== 1 ? { scale: 1.1, backgroundColor: "#f3f4f6" } : {}}
                                        whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </motion.button>
                                    {Array.from({ length: totalPages }).map((_, index) => (
                                        <motion.button
                                            key={index + 1}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`mx-1 w-8 h-8 rounded-full flex items-center justify-center ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'} transition-all duration-300`}
                                            aria-label={`Page ${index + 1}`}
                                            aria-current={currentPage === index + 1 ? "page" : undefined}
                                            whileHover={currentPage !== index + 1 ? { scale: 1.1 } : {}}
                                            whileTap={{ scale: 0.95 }}
                                            animate={currentPage === index + 1 ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {index + 1}
                                        </motion.button>
                                    ))}
                                    <motion.button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`mx-1 p-2 rounded-full ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'} transition-colors duration-300`}
                                        aria-label="Next page"
                                        whileHover={currentPage !== totalPages ? { scale: 1.1, backgroundColor: "#f3f4f6" } : {}}
                                        whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Desktop Sidebar */}
                <motion.div
                    ref={sidebarRef}
                    className="hidden md:block w-1/4 p-6 border-l border-gray-200"
                    initial="hidden"
                    animate={isSidebarInView ? "visible" : "hidden"}
                    variants={sidebarVariants}
                >
                    <div className="sticky top-6">
                        <div>
                            <motion.div
                                ref={searchRef}
                                className="relative mb-6 hidden md:flex"
                                initial="hidden"
                                animate={isSearchInView ? "visible" : "hidden"}
                                variants={searchVariants}
                            >
                                <input
                                    type="text"
                                    placeholder="Search marketing & sales blogs..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                />
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            </motion.div>
                            <motion.div
                                className="flex items-center mb-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.4 }}
                            >
                                <Bookmark className="h-5 w-5 text-blue-500 mr-2" />
                                <h2 className="text-lg font-bold text-gray-800">Categories</h2>
                            </motion.div>
                            <motion.ul
                                className="space-y-2"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {blogCategories.map((category, index) => (
                                    <motion.li
                                        key={index}
                                        variants={itemVariants}
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Link
                                            href={category.href}
                                            className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
                                        >

                                            {category.icon}
                                            {category.label}
                                        </Link>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </div>
                    </div>
                </motion.div>

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
                                variants={mobileSidebarVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Menu</h2>
                                    <motion.button
                                        className="p-1 rounded-md hover:bg-gray-100"
                                        onClick={() => setSidebarOpen(false)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <X className="h-5 w-5" />
                                    </motion.button>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center mb-3">
                                        <Bookmark className="h-5 w-5 text-blue-500 mr-2" />
                                        <h2 className="text-lg font-bold text-gray-800">Categories</h2>
                                    </div>
                                    <motion.ul
                                        className="space-y-3"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {blogCategories.map((category, index) => (
                                            <motion.li
                                                key={index}
                                                variants={itemVariants}
                                                whileHover={{ x: 5 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Link
                                                    href={category.href}
                                                    className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
                                                >
                                                    {category.icon}
                                                    {category.label}
                                                </Link>
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
};

export default Blogs;