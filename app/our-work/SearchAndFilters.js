import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"

const SearchAndFilters = ({
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    categories,
    filteredItems,
    visibleItems,
    clearSearch
}) => {
    return (
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
    )
}

export default SearchAndFilters
