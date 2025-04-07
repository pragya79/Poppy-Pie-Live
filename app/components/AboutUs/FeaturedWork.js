"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

const FeaturedWork = () => {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
    const [activeCase, setActiveCase] = useState(0)

    // Featured work data
    const featuredWork = [
        {
            id: 1,
            title: "Global Rebrand for TechVision",
            category: "Branding",
            description: "A complete brand transformation for a leading tech company, including new visual identity, messaging, and digital presence.",
            image: "/placeholder.svg",
            results: [
                "47% increase in brand recognition",
                "135% boost in website engagement",
                "52% improvement in customer perception"
            ],
            link: "/case-studies/techvision"
        },
        {
            id: 2,
            title: "Integrated Campaign for EcoLife",
            category: "Marketing",
            description: "A multi-channel marketing campaign for a sustainable lifestyle brand that increased market share and drove customer acquisition.",
            image: "/placeholder.svg",
            results: [
                "320% growth in social media followers",
                "78% increase in online sales",
                "4.2 million campaign impressions"
            ],
            link: "/case-studies/ecolife"
        },
        {
            id: 3,
            title: "E-commerce Transformation for StyleCo",
            category: "Digital Experience",
            description: "Redesigned the online shopping experience for a fashion retailer, optimizing for conversions and customer satisfaction.",
            image: "/placeholder.svg",
            results: [
                "156% increase in conversion rate",
                "68% reduction in cart abandonment",
                "43% increase in average order value"
            ],
            link: "/case-studies/styleco"
        },
        {
            id: 4,
            title: "Content Strategy for FinanceHub",
            category: "Content Creation",
            description: "Developed and executed a comprehensive content strategy for a financial services provider to establish thought leadership.",
            image: "/placeholder.svg",
            results: [
                "215% increase in organic traffic",
                "94 backlinks from industry publications",
                "62% improvement in lead quality"
            ],
            link: "/case-studies/financehub"
        }
    ]

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

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
    }

    const caseVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    const dotVariants = {
        inactive: { scale: 1 },
        active: {
            scale: 1.2,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    }

    const handlePrevCase = () => {
        setActiveCase((prev) => (prev === 0 ? featuredWork.length - 1 : prev - 1))
    }

    const handleNextCase = () => {
        setActiveCase((prev) => (prev === featuredWork.length - 1 ? 0 : prev + 1))
    }

    return (
        <section className="py-16 sm:py-20 md:py-24 bg-gray-900 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <pattern id="grid-work" width="8" height="8" patternUnits="userSpaceOnUse">
                            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid-work)" />
                </svg>
            </div>

            <div className="container mx-auto px-4 sm:px-6">
                <motion.div
                    ref={sectionRef}
                    className="max-w-screen-xl mx-auto"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                >
                    <motion.div className="text-center mb-12 sm:mb-16" variants={itemVariants}>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                            Our Work
                        </h2>
                        <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
                            Explore some of our recent projects and the results we&apos;ve achieved for our clients
                        </p>
                    </motion.div>

                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCase}
                                variants={caseVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                                className="rounded-xl overflow-hidden shadow-lg bg-gray-800/50 backdrop-blur-sm"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="relative h-64 sm:h-72 md:h-full">
                                        <Image
                                            src={featuredWork[activeCase].image}
                                            alt={featuredWork[activeCase].title}
                                            fill
                                            className="object-cover grayscale"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            data-placeholder={`case-study-${featuredWork[activeCase].id}`}
                                        />
                                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                            {featuredWork[activeCase].category}
                                        </div>
                                    </div>

                                    <div className="p-6 sm:p-8 md:p-10 flex flex-col">
                                        <h3 className="text-xl sm:text-2xl font-bold mb-3">{featuredWork[activeCase].title}</h3>
                                        <p className="text-gray-300 mb-6">{featuredWork[activeCase].description}</p>

                                        <div className="mb-6 flex-grow">
                                            <h4 className="text-lg font-medium mb-3">Key Results</h4>
                                            <ul className="space-y-2">
                                                {featuredWork[activeCase].results.map((result, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="text-gray-300 mr-2">✓</span>
                                                        <span className="text-gray-300">{result}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <Link href={featuredWork[activeCase].link}>
                                            <motion.button
                                                className="flex items-center text-gray-300 hover:text-white font-medium transition-colors"
                                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                            >
                                                View Case Study
                                                <ExternalLink className="ml-2 h-4 w-4" />
                                            </motion.button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation buttons */}
                        <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between pointer-events-none px-4">
                            <motion.button
                                className="bg-white/90 text-gray-900 hover:bg-white rounded-full p-2 shadow-lg pointer-events-auto"
                                onClick={handlePrevCase}
                                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.9, transition: { duration: 0.2 } }}
                                aria-label="Previous case study"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </motion.button>

                            <motion.button
                                className="bg-white/90 text-gray-900 hover:bg-white rounded-full p-2 shadow-lg pointer-events-auto"
                                onClick={handleNextCase}
                                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.9, transition: { duration: 0.2 } }}
                                aria-label="Next case study"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Pagination dots */}
                    <div className="flex justify-center space-x-2 mt-6">
                        {featuredWork.map((_, index) => (
                            <motion.button
                                key={index}
                                className={`w-2.5 h-2.5 rounded-full ${index === activeCase ? 'bg-white' : 'bg-white/40'}`}
                                onClick={() => setActiveCase(index)}
                                variants={dotVariants}
                                animate={index === activeCase ? "active" : "inactive"}
                                aria-label={`Go to case study ${index + 1}`}
                            />
                        ))}
                    </div>

                    <motion.div
                        className="mt-12 sm:mt-16 text-center"
                        variants={itemVariants}
                    >
                        <Link href="/work">
                            <motion.button
                                className="bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
                                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.98, transition: { duration: 0.2 } }}
                            >
                                View All Work
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default FeaturedWork