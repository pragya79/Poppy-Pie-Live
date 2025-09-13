import { motion, AnimatePresence } from "framer-motion"
import ProjectCard from "./ProjectCard"

const PortfolioGrid = ({
    visibleItems,
    searchTerm,
    loadMore,
    hasMore,
    isLoadingMore,
    isLoadingRef
}) => {
    return (
        <motion.section
            className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
        >
            <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                        layout
                    >
                        {visibleItems.map((item, index) => (
                            <ProjectCard
                                key={item.id}
                                item={item}
                                index={index}
                                searchTerm={searchTerm}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Load More Section */}
                {hasMore && (
                    <motion.div
                        className="text-center mt-12 sm:mt-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                    >
                        <motion.button
                            onClick={loadMore}
                            disabled={isLoadingMore}
                            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-black to-gray-800 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            whileHover={{
                                scale: 1.05,
                                y: -3,
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                initial={false}
                            />
                            <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                                {isLoadingMore ? (
                                    <>
                                        <motion.div
                                            className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 1,
                                                repeat: Number.POSITIVE_INFINITY,
                                                ease: "linear",
                                            }}
                                        />
                                        <span>Discovering More Stories...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>✨ Discover More Brand Stories</span>
                                        <motion.span
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Number.POSITIVE_INFINITY,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            →
                                        </motion.span>
                                    </>
                                )}
                            </span>
                        </motion.button>
                    </motion.div>
                )}

                {/* Loading indicator for infinite scroll */}
                <div ref={isLoadingRef} className="h-10" />
            </div>
        </motion.section>
    )
}

export default PortfolioGrid
