"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useSearchParams } from "next/navigation"

// Import hover effect components
import { HoverEffect } from "./HoverEffect"

// Import services data
import { products, services } from "./servicesData"

export default function ProductsAndServices() {
    // State for active section and card
    const [activeSection, setActiveSection] = useState("services")
    const [selectedItem, setSelectedItem] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    // Get URL query parameters
    const searchParams = useSearchParams()

    // Refs for animation targets
    const headerRef = useRef(null)
    const productsHeaderRef = useRef(null)
    const servicesHeaderRef = useRef(null)
    const scrollContainerRef = useRef(null)

    // Using Framer Motion's useInView for scroll-based animations
    const isHeaderInView = useInView(headerRef, { once: true })

    // Handle URL parameters on load
    useEffect(() => {
        // Check if a service ID was passed in the URL
        const serviceId = searchParams.get('service')
        const productId = searchParams.get('product')

        if (serviceId) {
            // Set active section to services
            setActiveSection('services')

            // Find the corresponding service
            const service = services.find(item => item.id === serviceId)
            if (service) {
                setSelectedItem(service)
                setModalOpen(true)
            }
        } else if (productId) {
            // Set active section to products
            setActiveSection('products')

            // Find the corresponding product
            const product = products.find(item => item.id === productId)
            if (product) {
                setSelectedItem(product)
                setModalOpen(true)
            }
        }
    }, [searchParams])

    // Format the data for hover effect component
    const formatItemsForHoverEffect = (items) => {
        return items.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            features: item.features,
            action: item.action,
            link: "#" // You can set actual links if needed
        }))
    }

    const productItems = formatItemsForHoverEffect(products)
    const serviceItems = formatItemsForHoverEffect(services)

    // Handle section tab changes
    const handleSectionChange = (section) => {
        setActiveSection(section)
    }

    // Handle "Know More" button clicks
    const handleKnowMore = (e, item) => {
        e.preventDefault()
        setSelectedItem(item)
        setModalOpen(true)
    }

    // Handle modal close
    const handleModalClose = () => {
        setModalOpen(false)
        setSelectedItem(null)
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

    return (
        <div className="w-full min-h-screen bg-background" ref={scrollContainerRef}>
            {/* Header navigation - Increased z-index to 50 to ensure it stays above expanded cards */}
            <motion.div
                ref={headerRef}
                className="sticky top-0 w-full bg-background/90 backdrop-blur-sm py-3 sm:py-4 px-4 sm:px-6 shadow-sm z-40 border-b"
                initial="hidden"
                animate={isHeaderInView ? "visible" : "hidden"}
                variants={headerVariants}
            >
                <div className="container mx-auto flex justify-between items-center">
                    <motion.h1
                        className="text-base sm:text-lg md:text-xl font-medium text-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        Products and Services
                    </motion.h1>
                </div>
            </motion.div>

            {/* Hero section */}
            <section className="relative bg-muted py-10 sm:py-12 md:py-16 lg:py-20">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
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
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-foreground">Solutions tailored for your needs</h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-4 sm:mb-6 md:mb-8">
                            Explore our comprehensive suite of products and services designed to elevate your business
                        </p>
                        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                            <button
                                onClick={() => handleSectionChange('products')}
                                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base ${activeSection === 'products'
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    : 'bg-transparent text-foreground border border-input hover:bg-accent hover:text-accent-foreground'
                                    }`}
                            >
                                View Products
                            </button>
                            <button
                                onClick={() => handleSectionChange('services')}
                                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base ${activeSection === 'services'
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    : 'bg-transparent text-foreground border border-input hover:bg-accent hover:text-accent-foreground'
                                    }`}
                            >
                                View Services
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
                {/* Tab navigation */}
                <nav className="flex mb-4 sm:mb-6 md:mb-8 border-b border-border overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
                    <motion.button
                        className={`pb-2 sm:pb-3 px-3 sm:px-4 md:px-6 text-sm sm:text-base md:text-lg font-medium relative whitespace-nowrap ${activeSection === 'products'
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                        onClick={() => handleSectionChange('products')}
                    >
                        Products
                        {activeSection === 'products' && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t"
                                layoutId="activeTab"
                                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                            />
                        )}
                    </motion.button>
                    <motion.button
                        className={`pb-2 sm:pb-3 px-3 sm:px-4 md:px-6 text-sm sm:text-base md:text-lg font-medium relative whitespace-nowrap ${activeSection === 'services'
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                        onClick={() => handleSectionChange('services')}
                    >
                        Services
                        {activeSection === 'services' && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t"
                                layoutId="activeTab"
                                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                            />
                        )}
                    </motion.button>
                </nav>

                {/* Products Section with Hover Effect */}
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
                                    className="text-base sm:text-lg md:text-xl font-medium text-foreground flex items-center"
                                    initial="hidden"
                                    animate={activeSection === 'products' ? "visible" : "hidden"}
                                    variants={sectionHeaderVariants}
                                >
                                    Products
                                    <span className="text-xs sm:text-sm text-muted-foreground ml-2">({products.length})</span>
                                </motion.h2>
                            </div>

                            {/* Pass modal state and handlers to HoverEffect component */}
                            <HoverEffect
                                items={productItems}
                                onKnowMore={handleKnowMore}
                                externalModalOpen={modalOpen}
                                externalSelectedItem={selectedItem}
                                onModalClose={handleModalClose}
                            />
                        </motion.section>
                    )}

                    {/* Services Section with Hover Effect */}
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
                                    className="text-base sm:text-lg md:text-xl font-medium text-foreground flex items-center"
                                    initial="hidden"
                                    animate={activeSection === 'services' ? "visible" : "hidden"}
                                    variants={sectionHeaderVariants}
                                >
                                    Services
                                    <span className="text-xs sm:text-sm text-muted-foreground ml-2">({services.length})</span>
                                </motion.h2>
                            </div>

                            {/* Pass modal state and handlers to HoverEffect component */}
                            <HoverEffect
                                items={serviceItems}
                                onKnowMore={handleKnowMore}
                                externalModalOpen={modalOpen}
                                externalSelectedItem={selectedItem}
                                onModalClose={handleModalClose}
                            />
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* CTA Section */}
                <section className="mt-8 sm:mt-10 md:mt-12 py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 bg-card rounded-xl shadow-md border">
                    <div className="max-w-3xl mx-auto text-center">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-foreground">Need custom solutions?</h3>
                        <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 text-muted-foreground">
                            Get in touch with our team for a personalized consultation and discover how we can help you achieve your goals.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                href="/contact-us"
                                className="inline-flex items-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base"
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