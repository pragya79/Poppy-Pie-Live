import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Clock, Calendar, ArrowRight, Star } from "lucide-react"

const ProjectCard = ({ item, index, searchTerm }) => {
    const highlightText = (text, searchTerm) => {
        if (!searchTerm) return text
        const regex = new RegExp(`(${searchTerm})`, "gi")
        const parts = text.split(regex)
        return parts.map((part, i) =>
            regex.test(part) ? (
                <mark key={i} className="bg-yellow-200 px-1 rounded">
                    {part}
                </mark>
            ) : (
                part
            )
        )
    }

    const getRandomColor = () => {
        const colors = [
            "from-blue-500 to-purple-600",
            "from-pink-500 to-rose-600",
            "from-emerald-500 to-teal-600",
            "from-orange-500 to-red-600",
            "from-indigo-500 to-blue-600",
            "from-purple-500 to-pink-600",
        ]
        return colors[index % colors.length]
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay: (index % 6) * 0.1,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: -20,
            transition: { duration: 0.2 },
        },
    }

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className="group"
        >
            <Link href={`/our-work/${item.id}`}>
                <motion.div
                    className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 cursor-pointer h-full"
                    whileHover={{
                        y: -8,
                        transition: { type: "spring", stiffness: 300, damping: 30 },
                    }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Enhanced gradient overlay */}
                    <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${getRandomColor()} opacity-0 group-hover:opacity-5 transition-opacity duration-500 z-10`}
                        initial={false}
                    />

                    {/* Image container with enhanced hover effects */}
                    <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden bg-gray-100">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
                            initial={false}
                        />

                        <Image
                            src={item.image || "/placeholder-image.jpg"}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Enhanced overlay content */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-30"
                            whileHover={{ scale: 1.05 }}
                        >
                            <motion.div
                                className="bg-white/90 backdrop-blur-sm rounded-full p-3 sm:p-4 shadow-xl"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                            </motion.div>
                        </motion.div>

                        {/* Enhanced category badge */}
                        <motion.div
                            className="absolute top-3 sm:top-4 left-3 sm:left-4 z-30"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + (index % 6) * 0.1 }}
                        >
                            <span className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r ${getRandomColor()} text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm`}>
                                {item.category}
                            </span>
                        </motion.div>

                        {/* Enhanced featured badge */}
                        {item.featured && (
                            <motion.div
                                className="absolute top-3 sm:top-4 right-3 sm:right-4 z-30"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    delay: 0.3 + (index % 6) * 0.1,
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                }}
                            >
                                <div className="bg-yellow-500 text-white p-1.5 sm:p-2 rounded-full shadow-lg">
                                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Enhanced content section */}
                    <div className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
                        {/* Title with enhanced styling */}
                        <motion.h3
                            className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 line-clamp-2 group-hover:text-black transition-colors duration-300"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (index % 6) * 0.1 }}
                        >
                            {highlightText(item.title, searchTerm)}
                        </motion.h3>

                        {/* Enhanced description */}
                        <motion.p
                            className="text-sm sm:text-base text-gray-600 line-clamp-3 leading-relaxed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (index % 6) * 0.1 }}
                        >
                            {highlightText(item.description, searchTerm)}
                        </motion.p>

                        {/* Enhanced client info */}
                        {item.client && (
                            <motion.div
                                className="flex items-center gap-2 text-xs sm:text-sm text-gray-500"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (index % 6) * 0.1 }}
                            >
                                <span className="font-medium">Client:</span>
                                <span className="font-semibold text-gray-700">
                                    {highlightText(item.client, searchTerm)}
                                </span>
                            </motion.div>
                        )}

                        {/* Enhanced metadata section */}
                        <motion.div
                            className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (index % 6) * 0.1 }}
                        >
                            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                                {item.duration && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{item.duration}</span>
                                    </div>
                                )}
                                {item.year && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{item.year}</span>
                                    </div>
                                )}
                            </div>

                            {/* Enhanced CTA */}
                            <motion.div
                                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold text-black opacity-0 group-hover:opacity-100 transition-all duration-300"
                                whileHover={{ x: 5 }}
                            >
                                <span>View Case Study</span>
                                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    )
}

export default ProjectCard
