"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const MissionVision = () => {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

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

    const boxVariants = {
        hidden: { opacity: 0, scale: 0.9 },
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
        <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
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
                            Our Purpose & Direction
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                            At the heart of Poppy Pie lies a clear purpose and vision that guide every project we undertake.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
                        <motion.div
                            className="bg-white rounded-xl shadow-md p-8 sm:p-10 flex flex-col h-full"
                            variants={boxVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                            <p className="text-gray-600 mb-4 flex-grow">
                                To empower businesses through innovative marketing strategies, creative branding solutions, and data-driven approaches that drive sustainable growth and lasting customer relationships.
                            </p>
                            <p className="text-gray-600 italic">
                                &quot;We transform vision into impact, connecting brands with their audiences through authentic storytelling and strategic execution.&quot;
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-xl shadow-md p-8 sm:p-10 flex flex-col h-full"
                            variants={boxVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <div className="rounded-full bg-indigo-100 w-16 h-16 flex items-center justify-center mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-indigo-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
                            <p className="text-gray-600 mb-4 flex-grow">
                                To be the most trusted partner for businesses seeking transformative marketing and branding solutions, recognized for our innovation, integrity, and measurable results that help shape the future of digital marketing.
                            </p>
                            <p className="text-gray-600 italic">
                                &quot;We envision a world where every business, regardless of size, can effectively communicate its unique value and connect meaningfully with its audience.&quot;
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        className="mt-12 sm:mt-16 text-center"
                        variants={itemVariants}
                    >
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Our Core Values</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 max-w-4xl mx-auto">
                            {[
                                { title: "Innovation", color: "bg-blue-100 text-blue-600" },
                                { title: "Integrity", color: "bg-indigo-100 text-indigo-600" },
                                { title: "Excellence", color: "bg-purple-100 text-purple-600" },
                                { title: "Collaboration", color: "bg-pink-100 text-pink-600" },
                                { title: "Impact", color: "bg-red-100 text-red-600" }
                            ].map((value, index) => (
                                <motion.div
                                    key={index}
                                    className={`${value.color} rounded-lg p-4 text-center`}
                                    variants={boxVariants}
                                    whileHover={{ y: -3, scale: 1.05, transition: { duration: 0.2 } }}
                                >
                                    <p className="font-medium">{value.title}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default MissionVision