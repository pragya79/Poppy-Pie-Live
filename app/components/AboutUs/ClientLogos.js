"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"

const ClientLogos = () => {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

    // Client logos data - using placeholder for now
    const clients = [
        { id: 1, name: "TechVision", logo: "/placeholder.svg" },
        { id: 2, name: "EcoLife", logo: "/placeholder.svg" },
        { id: 3, name: "StyleCo", logo: "/placeholder.svg" },
        { id: 4, name: "FinanceHub", logo: "/placeholder.svg" },
        { id: 5, name: "MediaGroup", logo: "/placeholder.svg" },
        { id: 6, name: "HealthPlus", logo: "/placeholder.svg" },
        { id: 7, name: "EduTech", logo: "/placeholder.svg" },
        { id: 8, name: "TravelWise", logo: "/placeholder.svg" }
    ]

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
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
                duration: 0.4,
                ease: "easeOut"
            }
        }
    }

    const logoVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    }

    return (
        <section className="py-16 sm:py-20 md:py-24 bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 sm:px-6">
                <motion.div
                    ref={sectionRef}
                    className="max-w-screen-xl mx-auto"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                >
                    <motion.div className="text-center mb-12 sm:mb-16" variants={itemVariants}>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Trusted by Leading Brands
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                            We&apos;ve had the privilege of working with diverse clients across multiple industries
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 sm:gap-12"
                        variants={containerVariants}
                    >
                        {clients.map((client) => (
                            <motion.div
                                key={client.id}
                                className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                variants={logoVariants}
                                whileHover={{
                                    y: -5,
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <div className="relative h-16 w-full">
                                    <Image
                                        src={client.logo}
                                        alt={client.name}
                                        fill
                                        className="object-contain opacity-80 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                        data-placeholder={`client-${client.id}`}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="mt-12 sm:mt-16 text-center"
                        variants={itemVariants}
                    >
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            From startups to established enterprises, we tailor our approach to meet the unique needs of each client, delivering results that drive business growth.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default ClientLogos