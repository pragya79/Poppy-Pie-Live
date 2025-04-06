"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"

// Import services data
import { products, services } from "./servicesData"

export default function ProductsAndServices() {
    // State for active section and card
    const [activeSection, setActiveSection] = useState("products")
    const [highlightedCard, setHighlightedCard] = useState(null)
    // State to track if we're on a touch device
    const [isTouchDevice, setIsTouchDevice] = useState(false)

    // Refs for animation targets
    const headerRef = useRef(null)
    const productsHeaderRef = useRef(null)
    const servicesHeaderRef = useRef(null)
    const scrollContainerRef = useRef(null)

    // Using Framer Motion's useInView for scroll-based animations
    const isHeaderInView = useInView(headerRef, { once: true })
    const isProductsHeaderInView = useInView(productsHeaderRef, { once: true, margin: "-100px 0px" })
    const isServicesHeaderInView = useInView(servicesHeaderRef, { once: true, margin: "-100px 0px" })

    // Detect touch device
    useEffect(() => {
        const detectTouch = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
        }
        detectTouch()
        window.addEventListener('touchstart', () => setIsTouchDevice(true), { once: true })

        return () => {
            window.removeEventListener('touchstart', () => setIsTouchDevice(true))
        }
    }, [])

    // Handle card focus events
    const handleCardFocus = (id) => {
        if (!isTouchDevice) {
            setHighlightedCard(id)
        }
    }

    const handleCardBlur = () => {
        if (!isTouchDevice) {
            setHighlightedCard(null)
        }
    }

    // Handle card click for touch devices
    const handleCardClick = (id) => {
        if (isTouchDevice) {
            setHighlightedCard(highlightedCard === id ? null : id)
        }
    }

    // Handle section tab changes
    const handleSectionChange = (section) => {
        setActiveSection(section)
    }

    // Animation variants
    const headerVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    const sectionHeaderVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    }

    const cardContainerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.05 // Reduced for better performance
            }
        }
    }

    const cardVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4, // Slightly faster for better performance
                ease: [0.25, 0.1, 0.25, 1]
            }
        },
        hover: {
            y: -5,
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        highlighted: {
            scale: 1.02,
            y: -7,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    }

    const buttonVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.025,
            x: 5,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        tap: {
            scale: 0.98,
            transition: {
                duration: 0.1,
                ease: "easeIn"
            }
        }
    }

    // Function to render a service/product card with bento grid styling
    const renderBentoCard = (item, index, isProduct = true) => {
        // Determine card size based on index for bento grid layout
        let sizeClass = "col-span-1 row-span-1"; // Default size

        if (isProduct) {
            // First product is large
            if (index === 0) {
                sizeClass = "col-span-2 row-span-2 md:col-span-2 md:row-span-2";
            }
            // Second product is tall
            else if (index === 1) {
                sizeClass = "col-span-1 row-span-2 md:col-span-1 md:row-span-2";
            }
        } else {
            // First service is large
            if (index === 0) {
                sizeClass = "col-span-2 row-span-2 md:col-span-2 md:row-span-2";
            }
            // Second service is tall
            else if (index === 1) {
                sizeClass = "col-span-1 row-span-2 md:col-span-1 md:row-span-2";
            }
        }

        return (
            <motion.div
                key={item.id}
                className={`relative bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col ${sizeClass}`}
                variants={cardVariants}
                whileHover={!isTouchDevice ? "hover" : undefined}
                animate={highlightedCard === item.id ? "highlighted" : "visible"}
                onMouseEnter={() => handleCardFocus(item.id)}
                onMouseLeave={handleCardBlur}
                onFocus={() => handleCardFocus(item.id)}
                onBlur={handleCardBlur}
                onClick={() => handleCardClick(item.id)}
                tabIndex={0}
            >
                {/* Card header */}
                <div className="relative p-4 sm:p-5 pb-3 sm:pb-4 border-b border-gray-100">
                    <h3 className="font-medium text-sm sm:text-base md:text-lg text-gray-800">{item.title}</h3>
                </div>

                {/* Card content */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col">
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 flex-grow line-clamp-4 sm:line-clamp-5 md:line-clamp-6">
                        {item.description}
                    </p>

                    <motion.div
                        className="self-start mt-auto"
                        variants={buttonVariants}
                        whileHover="hover"
                    >
                        <button
                            className="flex items-center text-gray-800 font-medium hover:text-gray-900 transition-colors text-xs sm:text-sm"
                            aria-label={`${item.action} for ${item.title}`}
                        >
                            {item.action}
                            <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-gray-100" ref={scrollContainerRef}>
            {/* Header navigation */}
            <motion.div
                ref={headerRef}
                className="sticky top-0 w-full bg-gray-300 py-3 sm:py-4 px-4 sm:px-6 shadow-sm z-10"
                initial="hidden"
                animate={isHeaderInView ? "visible" : "hidden"}
                variants={headerVariants}
            >
                <div className="container mx-auto flex justify-between items-center">
                    <motion.h1
                        className="text-base sm:text-lg md:text-xl font-medium text-gray-800"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        Products and Services
                    </motion.h1>
                </div>
            </motion.div>

            {/* Hero section */}
            <section className="relative bg-gray-200 py-10 sm:py-12 md:py-16 lg:py-20">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="black" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 sm:px-6 relative z-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-xl lg:max-w-2xl mx-auto md:mx-0"
                    >
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-gray-800">Solutions tailored for your needs</h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 md:mb-8">
                            Explore our comprehensive suite of products and services designed to elevate your business
                        </p>
                        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                            <button
                                onClick={() => handleSectionChange('products')}
                                className="bg-gray-800 text-white hover:bg-gray-700 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base"
                            >
                                View Products
                            </button>
                            <button
                                onClick={() => handleSectionChange('services')}
                                className="bg-transparent text-gray-800 border border-gray-800 hover:bg-gray-800 hover:text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base"
                            >
                                View Services
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
                {/* Tab navigation */}
                <nav className="flex mb-4 sm:mb-6 md:mb-8 border-b border-gray-200 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
                    <motion.button
                        className={`pb-2 sm:pb-3 px-3 sm:px-4 md:px-6 text-sm sm:text-base md:text-lg font-medium relative whitespace-nowrap ${activeSection === 'products'
                            ? 'text-gray-800'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => handleSectionChange('products')}
                    >
                        Products
                        {activeSection === 'products' && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 rounded-t"
                                layoutId="activeTab"
                                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                            />
                        )}
                    </motion.button>
                    <motion.button
                        className={`pb-2 sm:pb-3 px-3 sm:px-4 md:px-6 text-sm sm:text-base md:text-lg font-medium relative whitespace-nowrap ${activeSection === 'services'
                            ? 'text-gray-800'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => handleSectionChange('services')}
                    >
                        Services
                        {activeSection === 'services' && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 rounded-t"
                                layoutId="activeTab"
                                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                            />
                        )}
                    </motion.button>
                </nav>

                {/* Products Section with Bento Grid */}
                <AnimatePresence mode="wait">
                    {activeSection === 'products' && (
                        <motion.section
                            key="products-section"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-8 sm:mb-10 md:mb-12"
                        >
                            <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                                <motion.h2
                                    ref={productsHeaderRef}
                                    className="text-base sm:text-lg md:text-xl font-medium text-gray-800 flex items-center"
                                    initial="hidden"
                                    animate={activeSection === 'products' ? "visible" : "hidden"}
                                    variants={sectionHeaderVariants}
                                >
                                    Products
                                    <span className="text-xs sm:text-sm text-gray-500 ml-2">({products.length})</span>
                                </motion.h2>
                            </div>

                            {/* Bento grid layout for products */}
                            <motion.div
                                className="grid grid-cols-2 md:grid-cols-3 auto-rows-auto gap-3 sm:gap-4 md:gap-5"
                                variants={cardContainerVariants}
                                initial="hidden"
                                animate="visible"
                                key="products-grid"
                            >
                                {products.map((product, index) => renderBentoCard(product, index, true))}
                            </motion.div>
                        </motion.section>
                    )}

                    {/* Services Section with Bento Grid */}
                    {activeSection === 'services' && (
                        <motion.section
                            key="services-section"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-8 sm:mb-10 md:mb-12"
                        >
                            <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                                <motion.h2
                                    ref={servicesHeaderRef}
                                    className="text-base sm:text-lg md:text-xl font-medium text-gray-800 flex items-center"
                                    initial="hidden"
                                    animate={activeSection === 'services' ? "visible" : "hidden"}
                                    variants={sectionHeaderVariants}
                                >
                                    Services
                                    <span className="text-xs sm:text-sm text-gray-500 ml-2">({services.length})</span>
                                </motion.h2>
                            </div>

                            {/* Bento grid layout for services */}
                            <motion.div
                                className="grid grid-cols-2 md:grid-cols-3 auto-rows-auto gap-2 sm:gap-3 md:gap-4"
                                variants={cardContainerVariants}
                                initial="hidden"
                                animate="visible"
                                key="services-grid"
                            >
                                {services.map((service, index) => renderBentoCard(service, index, false))}
                            </motion.div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* CTA Section */}
                <section className="mt-8 sm:mt-10 md:mt-12 py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 bg-gray-800 rounded-xl shadow-xl text-white">
                    <div className="max-w-3xl mx-auto text-center">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4">Need custom solutions?</h3>
                        <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 text-gray-300">
                            Get in touch with our team for a personalized consultation and discover how we can help you achieve your goals.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                href="/contact-us"
                                className="inline-flex items-center bg-white text-gray-800 hover:bg-gray-100 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base"
                            >
                                Schedule a Consultation
                                <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </div>
        </div>
    )
}