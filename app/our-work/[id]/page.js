"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ExternalLink, Calendar, User, Tag, Sparkles, Eye, Award } from "lucide-react"
import { portfolioItems } from "../DataUtility"

const ProjectDetailPage = ({ params }) => {
    const [project, setProject] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [relatedProjects, setRelatedProjects] = useState([])

    useEffect(() => {
        // Find project by ID from URL params
        const foundProject = portfolioItems.find(item =>
            item.id.toString() === params.id ||
            item.title.toLowerCase().replace(/\s+/g, '-') === params.id
        )

        if (foundProject) {
            setProject(foundProject)

            // Get related projects from same category
            const related = portfolioItems
                .filter(item =>
                    item.category === foundProject.category &&
                    item.id !== foundProject.id
                )
                .slice(0, 3)
            setRelatedProjects(related)
        }

        setIsLoading(false)
    }, [params.id])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <motion.div
                    className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
                    <p className="text-gray-600">The project you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        )
    }

    // Mock project images - you can replace these with real project images
    const projectImages = [
        {
            id: 1,
            image: project.image || "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            alt: `${project.title} - Image 1`
        },
        {
            id: 2,
            image: project.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            alt: `${project.title} - Image 2`
        },
        {
            id: 3,
            image: project.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            alt: `${project.title} - Image 3`
        }
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* Back Button */}
            <motion.div
                className="fixed top-4 sm:top-6 lg:top-24 left-4 sm:left-6 lg:left-8 z-50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <motion.button
                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg backdrop-blur-sm"
                    onClick={() => window.history.back()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs sm:text-sm font-medium">Back</span>
                </motion.button>
            </motion.div>

            {/* Main Content - Sticky Scroll Layout */}
            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left Side - Scrolling Images */}
                <div className="lg:w-1/2 lg:h-screen lg:overflow-y-scroll scrollbar-hide px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
                    <div className="py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-16 space-y-8 sm:space-y-12">
                        {projectImages.map((imageItem, index) => (
                            <motion.div
                                key={imageItem.id}
                                className="relative group flex justify-center"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                            >
                                {/* Image Card */}
                                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl bg-white mt-8 sm:mt-12 w-full max-w-md lg:max-w-none">
                                    <div className="aspect-[3/4] overflow-hidden">
                                        <img
                                            src={imageItem.image}
                                            alt={imageItem.alt}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Sticky Content */}
                <div className="lg:w-1/2 lg:sticky lg:top-0 lg:h-screen flex items-center">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-8 sm:py-12 lg:py-16">
                        <motion.div
                            className="max-w-xl"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            {/* Project Title */}
                            <div className="mb-8 sm:mb-12">
                                <motion.h1
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    {project.title}
                                </motion.h1>
                                <motion.div
                                    className="flex items-center gap-3 mb-6 sm:mb-8"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                >
                                    <span className="text-2xl sm:text-3xl lg:text-4xl">🇨🇦</span>
                                </motion.div>
                            </div>

                            {/* Project Description */}
                            <motion.div
                                className="mb-8 sm:mb-12 space-y-4 sm:space-y-6"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                                    {project.client} offers Certification in Defensive Driving for Commercial Vehicle Drivers in Canada.
                                </p>
                                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                                    The website is aimed at offering information about the program, it&apos;s benefits and online enrolment touch points for potential audience.
                                </p>
                                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                                    The second upcoming part of the website shall features an online course module where the online certification can be enrolled for along with taking online exam module by module to attain a digital certification.
                                </p>
                                <p className="text-gray-800 text-base sm:text-lg leading-relaxed font-medium">
                                    Looking for a website for your business? We are a tap away!
                                </p>
                            </motion.div>

                            {/* Services */}
                            <motion.div
                                className="mb-6 sm:mb-8"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.7 }}
                            >
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-3">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    services:
                                </h3>
                                <div className="text-gray-600 text-base sm:text-lg pl-5">
                                    <p className="mb-1">Website Design & Development,</p>
                                    <p>Branding, Logo Design</p>
                                </div>
                            </motion.div>

                            {/* Client */}
                            <motion.div
                                className="mb-8 sm:mb-12"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                            >
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-3">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    client:
                                </h3>
                                <p className="text-gray-600 text-base sm:text-lg pl-5">{project.client}</p>
                            </motion.div>

                            {/* CTA Buttons */}
                            <motion.div
                                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.9 }}
                            >
                                <motion.button
                                    className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-semibold rounded-xl sm:rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Start Your Project
                                </motion.button>
                                <motion.button
                                    className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-xl sm:rounded-2xl hover:bg-gray-900 hover:text-white transition-all duration-300 text-sm sm:text-base"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    View Live Site
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
                <motion.section
                    className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-gray-50"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="max-w-7xl mx-auto">
                        <motion.h2
                            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 sm:mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            Related Projects
                        </motion.h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {relatedProjects.map((relatedProject, index) => (
                                <motion.div
                                    key={relatedProject.id}
                                    className="group cursor-pointer"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index }}
                                    whileHover={{ y: -8 }}
                                    onClick={() => {
                                        window.location.href = `/our-work/${relatedProject.id}`
                                    }}
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                                        <img
                                            src={relatedProject.image || "/placeholder.svg"}
                                            alt={relatedProject.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400">
                                            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                                                <h3 className="text-white font-bold text-base sm:text-lg mb-2">
                                                    {relatedProject.title}
                                                </h3>
                                                <p className="text-white/80 text-xs sm:text-sm mb-3">
                                                    {relatedProject.client} • {relatedProject.year}
                                                </p>
                                                <div className="flex gap-2">
                                                    {relatedProject.tags.slice(0, 2).map((tag, tagIndex) => (
                                                        <span
                                                            key={tagIndex}
                                                            className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                                                <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full text-white">
                                                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    )
}

export default ProjectDetailPage