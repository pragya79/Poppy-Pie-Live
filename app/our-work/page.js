"use client"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, Sparkles, Plus, Search, X } from "lucide-react"
import { portfolioItems, categories, categoryMap } from "./DataUtility"
import Link from "next/link"
import { ThreeDMarquee } from "@/components/ui/3d-marquee"

// Enhanced Loading Component
const CreativeLoader = () => {
    return (
        <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
            <div className="relative">
                {/* Main container */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24">
                    {/* Outer rotating ring */}
                    <motion.div
                        className="absolute inset-0 border-2 sm:border-3 lg:border-4 border-gray-200 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />

                    {/* Inner rotating ring */}
                    <motion.div
                        className="absolute inset-1 sm:inset-2 border-2 sm:border-3 lg:border-4 border-transparent border-t-black rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />

                    {/* Center pulsing dot */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: 1.2 }}
                        transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            ease: "easeInOut",
                        }}
                    >
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-black rounded-full" />
                    </motion.div>

                    {/* Floating particles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"
                            style={{
                                top: "50%",
                                left: "50%",
                                transformOrigin: "0 0",
                            }}
                            animate={{
                                rotate: 360,
                                scale: 1,
                                opacity: 1,
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.3,
                                ease: "linear",
                            }}
                            initial={{
                                x: Math.cos((i * 60 * Math.PI) / 180) * (typeof window !== 'undefined' && window.innerWidth < 640 ? 25 : typeof window !== 'undefined' && window.innerWidth < 1024 ? 35 : 40),
                                y: Math.sin((i * 60 * Math.PI) / 180) * (typeof window !== 'undefined' && window.innerWidth < 640 ? 25 : typeof window !== 'undefined' && window.innerWidth < 1024 ? 35 : 40),
                            }}
                        />
                    ))}
                </div>

                {/* Loading text */}
                <motion.div
                    className="mt-4 sm:mt-6 text-center"
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                >
                    <p className="text-gray-600 font-medium text-sm sm:text-base">Loading brand stories...</p>
                    <div className="flex justify-center mt-2 space-x-1">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"
                                animate={{ y: -6 }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

const OurWorkPage = () => {
    const [activeCategory, setActiveCategory] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [visibleCount, setVisibleCount] = useState(12) // Show initial 12 items (4 rows × 3 cols)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const ITEMS_PER_LOAD = 12 // 4 rows × 3 columns

    // Memoized filtered items for better performance
    const filteredItems = useMemo(() => {
        return portfolioItems.filter((item) => {
            // CLEAN category matching 👇
            const matchesCategory =
                activeCategory === "all" ||
                item.category === categoryMap[activeCategory]

            const matchesSearch =
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase())

            return matchesCategory && matchesSearch
        })
    }, [activeCategory, searchTerm])

    const featuredProjectImages = portfolioItems
        .slice(0, 20)
        .map(item => item.image);


    // Reset visible count when filters change
    useEffect(() => {
        setIsLoading(true)
        setVisibleCount(12) // Reset visible count when filters change

        // Simulate loading delay
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 800)

        return () => clearTimeout(timer)
    }, [activeCategory, searchTerm])

    // Load more items
    const handleLoadMore = () => {
        setIsLoadingMore(true)

        setTimeout(() => {
            setVisibleCount(prev => prev + ITEMS_PER_LOAD)
            setIsLoadingMore(false)
        }, 600)
    }

    // Clear search
    const clearSearch = () => {
        setSearchTerm("")
    }

    // Get visible items
    const visibleItems = filteredItems.slice(0, visibleCount)
    const hasMore = visibleCount < filteredItems.length

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.9,
        },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: custom * 0.1,
            },
        }),
    }

    return (
        <>
            {/* Custom CSS for eye cursor */}
            <style jsx>{`
                .eye-cursor {
                    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2'%3E%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E") 12 12, crosshair;
                }
                
                /* Fallback for browsers that don't support custom cursors */
                @supports not (cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E")) {
                    .eye-cursor {
                        cursor: zoom-in;
                    }
                }
            `}</style>

            <section className="py-16">
                <h2 className="text-4xl font-bold text-center mb-12">Featured Projects</h2>
                <ThreeDMarquee
                    images={featuredProjectImages}
                    className="h-[600px] mx-auto"
                />
            </section>

            <div className="min-h-screen bg-white">
                {/* Hero Section with Background Image */}
                <motion.section
                    className="relative h-[40vh] sm:h-[45vh] md:h-[52vh] w-[90%] sm:w-4/5 max-w-6xl mx-auto overflow-hidden rounded-2xl sm:rounded-3xl my-4 sm:my-6 lg:my-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                            alt="Creative workspace"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-pink-900/60 to-orange-900/70"></div>

                    {/* Hero Content */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
                        <div className="text-center">
                            <motion.h1
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                                style={{
                                    textShadow: "0 8px 32px rgba(0,0,0,0.5)",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                our work
                            </motion.h1>
                        </div>
                    </div>
                </motion.section>

                {/* Enhanced Search and Filter Section */}
                <motion.section
                    className="py-8 sm:py-10 lg:py-12 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <div className="max-w-6xl mx-auto">
                        {/* Search Bar */}
                        <motion.div
                            className="mb-8 max-w-md mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                        >
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search projects, clients, or services..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors text-sm"
                                />
                                {searchTerm && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>

                        {/* Category Filter Tabs */}
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category.key}
                                    className={`relative px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 rounded-full border-2 ${activeCategory === category.key
                                        ? "text-white bg-black border-black shadow-lg shadow-black/20"
                                        : "text-gray-700 bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
                                        }`}
                                    onClick={() => setActiveCategory(category.key)}
                                    whileHover={{
                                        scale: 1.05,
                                        y: -2,
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                                >
                                    {/* Enhanced background effect */}
                                    {activeCategory === category.key && (
                                        <motion.div
                                            className="absolute inset-0 bg-black rounded-full"
                                            layoutId="activeCategory"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 25,
                                            }}
                                        />
                                    )}

                                    <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                                        <span className="whitespace-nowrap">{category.label}</span>
                                        <motion.span
                                            className={`text-xs px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-bold ${activeCategory === category.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                                                }`}
                                            animate={{ scale: 1.02 }}
                                            transition={{
                                                duration: 0.5,
                                                type: "spring",
                                                repeatType: "reverse",
                                                repeat: Number.POSITIVE_INFINITY,
                                            }}
                                        >
                                            {category.count}
                                        </motion.span>
                                    </span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Enhanced results indicator */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                className="mt-6 sm:mt-8 text-center"
                                key={`${filteredItems.length}-${searchTerm}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.p
                                    className="text-gray-600 text-sm sm:text-base font-medium px-4"
                                    animate={{ scale: 1.02 }}
                                    transition={{
                                        duration: 0.5,
                                        type: "spring",
                                        repeatType: "reverse",
                                        repeat: Number.POSITIVE_INFINITY,
                                    }}
                                >
                                    {filteredItems.length === 0 ? (
                                        <span className="text-orange-500 flex items-center justify-center gap-2 flex-wrap">
                                            <span>🎭</span>
                                            <span>No brand stories found{searchTerm ? ` for "${searchTerm}"` : " in this category"}</span>
                                        </span>
                                    ) : filteredItems.length === 1 ? (
                                        <span className="flex items-center justify-center gap-2 flex-wrap">
                                            <span>🎯</span>
                                            <span>Found 1 amazing brand story</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2 flex-wrap">
                                            <span>✨</span>
                                            <span>Showcasing {visibleItems.length} of {filteredItems.length} brand success stories</span>
                                        </span>
                                    )}
                                </motion.p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.section>

                {/* Enhanced Portfolio Grid */}
                <section className="py-12 sm:py-14 lg:py-16 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <CreativeLoader />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="grid"
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {visibleItems.map((item, index) => (
                                        <Link href={'/our-work/' + item.id} key={item.id}>
                                            <motion.div
                                                className="group eye-cursor"
                                                variants={itemVariants}
                                                custom={index}
                                                whileHover={{ y: -8 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                            >
                                                <div className="relative aspect-[4/3] overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                                                    {/* Enhanced Image */}
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        loading="lazy"
                                                    />

                                                    {/* Enhanced Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400">
                                                        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                                                            <motion.h3
                                                                className="text-white font-bold text-base sm:text-lg mb-2"
                                                                initial={{ y: 20, opacity: 0 }}
                                                                whileInView={{ y: 0, opacity: 1 }}
                                                                transition={{ delay: 0.1 }}
                                                            >
                                                                {item.title}
                                                            </motion.h3>
                                                            <motion.p
                                                                className="text-white/80 text-xs sm:text-sm mb-3"
                                                                initial={{ y: 20, opacity: 0 }}
                                                                whileInView={{ y: 0, opacity: 1 }}
                                                                transition={{ delay: 0.2 }}
                                                            >
                                                                {item.client} • {item.year}
                                                            </motion.p>
                                                            <motion.div
                                                                className="flex gap-2 flex-wrap"
                                                                initial={{ y: 20, opacity: 0 }}
                                                                whileInView={{ y: 0, opacity: 1 }}
                                                                transition={{ delay: 0.3 }}
                                                            >
                                                                {item.tags.slice(0, 2).map((tag, tagIndex) => (
                                                                    <span
                                                                        key={tagIndex}
                                                                        className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                                {item.tags.length > 2 && (
                                                                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                                                                        +{item.tags.length - 2}
                                                                    </span>
                                                                )}
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Load More Button */}
                        {!isLoading && filteredItems.length > 0 && hasMore && (
                            <motion.div
                                className="flex justify-center mt-12 sm:mt-16 px-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.button
                                    className="relative px-8 sm:px-10 lg:px-12 py-3 sm:py-4 bg-black text-white font-bold rounded-xl sm:rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2 sm:gap-3 group overflow-hidden text-sm sm:text-base"
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {/* Animated background */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black"
                                        initial={{ x: "-100%" }}
                                        whileHover={{ x: "0%" }}
                                        transition={{ duration: 0.3 }}
                                    />

                                    <span className="relative z-10 flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                                        {isLoadingMore ? (
                                            <>
                                                <motion.div
                                                    className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                />
                                                <span>Loading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <motion.div
                                                    whileHover={{ rotate: 90 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </motion.div>
                                                <span>Load More Projects</span>
                                                <span className="text-xs sm:text-sm opacity-80 hidden sm:inline">
                                                    ({Math.min(ITEMS_PER_LOAD, filteredItems.length - visibleCount)} more)
                                                </span>
                                            </>
                                        )}
                                    </span>
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Enhanced No Results */}
                        {!isLoading && filteredItems.length === 0 && (
                            <motion.div className="text-center py-16 sm:py-20 lg:py-24 px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <motion.div
                                    className="text-gray-300 mb-6"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                >
                                    <Filter className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" />
                                </motion.div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No projects found</h3>
                                <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                                    {searchTerm
                                        ? `We couldn't find any projects matching "${searchTerm}". Try different keywords or browse our categories.`
                                        : "We couldn't find any projects matching your criteria. Try selecting a different category to explore our diverse portfolio of brand success stories."
                                    }
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    {searchTerm && (
                                        <motion.button
                                            className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold text-sm sm:text-base"
                                            onClick={clearSearch}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Clear Search
                                        </motion.button>
                                    )}
                                    <motion.button
                                        className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold shadow-lg text-sm sm:text-base"
                                        onClick={() => {
                                            setActiveCategory("all")
                                            setSearchTerm("")
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Show All Projects
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Enhanced Call to Action */}
                <motion.section
                    className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    {/* Background decoration */}
                    <div className="absolute inset-0 opacity-5">
                        <motion.div
                            className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-black rounded-full"
                            animate={{ scale: 1.2, rotate: 360 }}
                            transition={{
                                duration: 20,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                            }}
                        />
                        <motion.div
                            className="absolute bottom-10 right-10 w-16 h-16 sm:w-24 sm:h-24 bg-black rounded-lg"
                            animate={{ rotate: 45 }}
                            transition={{
                                duration: 15,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                            }}
                        />
                    </div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <motion.div
                            className="mb-4 sm:mb-6"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto" />
                        </motion.div>

                        <motion.h2
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            Ready to Craft Your Brand Story?
                        </motion.h2>

                        <motion.p
                            className="text-gray-600 text-lg sm:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            From market research to automation solutions, we&apos;ve helped 10+ brands achieve sustainable growth. Every brand deserves to be a success story.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.button
                                className="px-8 sm:px-10 py-3 sm:py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl text-sm sm:text-base"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.open('mailto:contact@thepoppypie.com', '_blank')}
                            >
                                Start Your Brand Journey
                            </motion.button>
                            <motion.button
                                className="px-8 sm:px-10 py-3 sm:py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 text-sm sm:text-base"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.open('https://www.thepoppypie.com', '_blank')}
                            >
                                Visit Our Website
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.section>
            </div>
        </>
    )
}

export default OurWorkPage