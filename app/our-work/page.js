"use client"
import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter } from "lucide-react"
import { portfolioItems, categories, categoryMap } from "./DataUtility"
import CreativeLoader from "./CreativeLoader"
import HeroSection from "./HeroSection"
import SearchAndFilters from "./SearchAndFilters"
import PortfolioGrid from "./PortfolioGrid"
import CallToActionSection from "./CallToActionSection"

const OurWorkPage = () => {
    const [activeCategory, setActiveCategory] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [visibleCount, setVisibleCount] = useState(12)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const isLoadingRef = useRef(null)

    const ITEMS_PER_LOAD = 12

    // Memoized filtered items for better performance
    const filteredItems = useMemo(() => {
        return portfolioItems.filter((item) => {
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

    const featuredProjectImages = portfolioItems.slice(0, 20).map(item => item.image)

    // Reset visible count when filters change
    useEffect(() => {
        setIsLoading(true)
        setVisibleCount(12)

        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 800)

        return () => clearTimeout(timer)
    }, [activeCategory, searchTerm])

    // Load more items
    const loadMore = () => {
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

    return (
        <>
            {/* Custom CSS for eye cursor */}
            <style jsx>{`
                .eye-cursor {
                    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2'%3E%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E") 12 12, crosshair;
                }
            `}</style>

            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <HeroSection featuredProjectImages={featuredProjectImages} />

                {/* Search and Filter Section */}
                <SearchAndFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    categories={categories}
                    filteredItems={filteredItems}
                    visibleItems={visibleItems}
                    clearSearch={clearSearch}
                />

                {/* Portfolio Grid or Loading */}
                <section className="py-12 sm:py-14 lg:py-16 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div
                                    key="loader"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <CreativeLoader />
                                </motion.div>
                            ) : (
                                <PortfolioGrid
                                    visibleItems={visibleItems}
                                    searchTerm={searchTerm}
                                    loadMore={loadMore}
                                    hasMore={hasMore}
                                    isLoadingMore={isLoadingMore}
                                    isLoadingRef={isLoadingRef}
                                />
                            )}
                        </AnimatePresence>

                        {/* Enhanced No Results */}
                        {!isLoading && filteredItems.length === 0 && (
                            <motion.div
                                className="text-center py-16 sm:py-20 lg:py-24 px-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
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

                {/* Call to Action */}
                <CallToActionSection />
            </div>
        </>
    )
}

export default OurWorkPage