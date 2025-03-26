"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ChevronRight, ExternalLink, ArrowRight, Menu, X } from "lucide-react"

export default function ProductsAndServices() {
    // State for mobile navigation
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    // State for active section
    const [activeSection, setActiveSection] = useState("products")
    // State for highlighted card
    const [highlightedCard, setHighlightedCard] = useState(null)

    // Refs for animation targets
    const headerRef = useRef(null)
    const productsHeaderRef = useRef(null)
    const servicesHeaderRef = useRef(null)
    const scrollContainerRef = useRef(null)

    // Using Framer Motion's useInView for scroll-based animations
    const isHeaderInView = useInView(headerRef, { once: true })
    const isProductsHeaderInView = useInView(productsHeaderRef, { once: true, margin: "-100px 0px" })
    const isServicesHeaderInView = useInView(servicesHeaderRef, { once: true, margin: " 100px 0px" })

    const products = [
        {
            id: "product-1",
            title: "AI Marketing Manager",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vestibulum at lvelit purus dictum nisi, vel volutpat quam elit vel ex. The hello world of this can",
            action: "Try Beta",
            tag: "Popular",
        },
        {
            id: "product-2",
            title: "AI Lead Generator",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vestibulum at lvelit purus dictum nisi, vel volutpat quam elit vel ex. The hello world of this can",
            action: "Try Beta",
            tag: "New",
        },
        {
            id: "product-3",
            title: "AI Web Scraper",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vestibulum at lvelit purus dictum nisi, vel volutpat quam elit vel ex. The hello world of this can",
            action: "Try Beta",
        },
        {
            id: "product-4",
            title: "AI Campaign Manager",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vestibulum at lvelit purus dictum nisi, vel volutpat quam elit vel ex. The hello world of this can",
            action: "Try Beta",
        },
    ]

    const services = [
        {
            id: "service-1",
            title: "Brand Management",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vestibulum at lvelit purus dictum nisi, vel volutpat quam elit vel ex. The hello world of this can",
            action: "Contact Us",
            tag: "Featured",
        },
        {
            id: "service-2",
            title: "Re-Branding",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vestibulum at lvelit purus dictum nisi, vel volutpat quam elit vel ex. The hello world of this can",
            action: "Contact Us",
        },
        {
            id: "service-3",
            title: "Marketing Services",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vestibulum at lvelit purus dictum nisi, vel volutpat quam elit vel ex. The hello world of this can",
            action: "Contact Us",
            tag: "Popular",
        },
        {
            id: "service-4",
            title: "Funnel Creation",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vestibulum at lvelit purus dictum nisi, vel volutpat quam elit vel ex. The hello world of this can",
            action: "Contact Us",
        },
        {
            id: "service-5",
            title: "Content Management",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vestibulum at lvelit purus dictum nisi, vel volutpat quam elit vel ex. The hello world of this can",
            action: "Contact Us",
        },
    ]

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
                staggerChildren: 0.1
            }
        }
    }

    const cardVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1]
            }
        },
        hover: {
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        tap: {
            scale: 0.98,
            transition: {
                duration: 0.1,
                ease: "easeIn"
            }
        },
        highlighted: {
            scale: 1.02,
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

    // Handle card focus
    const handleCardFocus = (id) => {
        setHighlightedCard(id);
    }

    const handleCardBlur = () => {
        setHighlightedCard(null);
    }

    // Handle section tabs 
    const handleSectionChange = (section) => {
        setActiveSection(section);
    }

    return (
        <div className="w-full min-h-screen bg-gray-100" ref={scrollContainerRef}>
            {/* Header navigation */}
            <motion.div
                ref={headerRef}
                className="sticky top-0 w-full bg-gray-300 py-4 px-6 shadow-sm"
                initial="hidden"
                animate={isHeaderInView ? "visible" : "hidden"}
                variants={headerVariants}
            >
                <div className="container mx-auto flex justify-between items-center">
                    <motion.h1
                        className="text-xl font-medium text-gray-800"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        Products and Services
                    </motion.h1>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-8">
                {/* Tab indicators for desktop */}
                <div className="flex mb-6 border-b border-gray-200">
                    <motion.button
                        className={`pb-2 mr-6 text-base font-medium relative ${activeSection === 'products' ? 'text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => handleSectionChange('products')}
                    >
                        Products
                        {activeSection === 'products' && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800"
                                layoutId="tabIndicator"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </motion.button>
                    <motion.button
                        className={`pb-2 mr-6 text-base font-medium relative ${activeSection === 'services' ? 'text-black' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => handleSectionChange('services')}
                    >
                        Services
                        {activeSection === 'services' && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800"
                                layoutId="tabIndicator"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </motion.button>
                </div>

                {/* Products Section */}
                <AnimatePresence mode="wait">
                    {activeSection === 'products' && (
                        <motion.div
                            key="products-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="mb-8"
                        >
                            <motion.h2
                                ref={productsHeaderRef}
                                className="text-xl font-medium mb-6 text-gray-800 flex items-center"
                                initial="hidden"
                                animate={isProductsHeaderInView ? "visible" : "hidden"}
                                variants={sectionHeaderVariants}
                            >
                                Products
                                <span className="text-sm text-gray-500 ml-2">({products.length})</span>
                            </motion.h2>
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                variants={cardContainerVariants}
                                initial="hidden"
                                animate={isProductsHeaderInView ? "visible" : "hidden"}
                            >
                                {products.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        className="bg-gray-200 p-5 flex flex-col justify-between relative overflow-hidden"
                                        variants={cardVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        animate={highlightedCard === product.id ? "highlighted" : "visible"}
                                        onMouseEnter={() => handleCardFocus(product.id)}
                                        onMouseLeave={handleCardBlur}
                                        onFocus={() => handleCardFocus(product.id)}
                                        onBlur={handleCardBlur}
                                        tabIndex={0}
                                    >
                                        {product.tag && (
                                            <div className="absolute top-0 right-0">
                                                <div className={`px-2 py-1 text-xs font-medium ${product.tag === 'New' ? 'bg-gray-700 text-white' : 'bg-gray-400 text-gray-800'}`}>
                                                    {product.tag}
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-medium text-base mb-3 text-gray-800">{product.title}</h3>
                                            <p className="text-gray-600 text-sm mb-5">{product.description}</p>
                                        </div>
                                        <motion.button
                                            className="self-start text-base font-medium text-gray-800 hover:text-gray-900 transition-colors flex items-center"
                                            variants={buttonVariants}
                                            whileHover="hover"
                                            whileTap="tap"
                                        >
                                            {product.action}
                                            <ChevronRight size={16} className="ml-1 opacity-70" />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Services Section */}
                    {activeSection === 'services' && (
                        <motion.div
                            key="services-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.h2
                                ref={servicesHeaderRef}
                                className="text-xl font-medium mb-6 text-gray-800 flex items-center"
                                initial="hidden"
                                animate={isServicesHeaderInView ? "visible" : "hidden"}
                                variants={sectionHeaderVariants}
                            >
                                Services
                                <span className="text-sm text-gray-500 ml-2">({services.length})</span>
                            </motion.h2>
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                variants={cardContainerVariants}
                                initial="hidden"
                                animate={isServicesHeaderInView ? "visible" : "hidden"}
                            >
                                {services.map((service) => (
                                    <motion.div
                                        key={service.id}
                                        className="bg-gray-200 p-5 flex flex-col justify-between relative overflow-hidden"
                                        variants={cardVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        animate={highlightedCard === service.id ? "highlighted" : "visible"}
                                        onMouseEnter={() => handleCardFocus(service.id)}
                                        onMouseLeave={handleCardBlur}
                                        onFocus={() => handleCardFocus(service.id)}
                                        onBlur={handleCardBlur}
                                        tabIndex={0}
                                    >
                                        {service.tag && (
                                            <div className="absolute top-0 right-0">
                                                <div className={`px-2 py-1 text-xs font-medium ${service.tag === 'Featured' ? 'bg-gray-700 text-white' : 'bg-gray-400 text-gray-800'}`}>
                                                    {service.tag}
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-medium text-base mb-3 text-gray-800">{service.title}</h3>
                                            <p className="text-gray-600 text-sm mb-5">{service.description}</p>
                                        </div>
                                        <motion.button
                                            className="self-start text-base font-medium text-gray-800 hover:text-gray-900 transition-colors flex items-center"
                                            variants={buttonVariants}
                                            whileHover="hover"
                                            whileTap="tap"
                                        >
                                            {service.action}
                                            <ChevronRight size={16} className="ml-1 opacity-70" />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer CTA */}
                <motion.div
                    className="mt-12 border-t border-gray-300 pt-8 pb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: "-100px 0px" }}
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h3 className="text-base font-medium text-gray-800 mb-1">Need custom solutions?</h3>
                            <p className="text-sm text-gray-600">Contact our team for personalized assistance</p>
                        </div>
                        <motion.button
                            className="mt-4 sm:mt-0 flex items-center text-gray-800 hover:text-gray-900 font-medium"
                            whileHover={{ x: 5 }}
                            whileTap={{ x: 0 }}
                        >
                            Schedule a consultation <ArrowRight size={16} className="ml-2" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}