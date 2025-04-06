"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"

const CompanyHistory = () => {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

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

    const timelineVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.4
            }
        }
    }

    const timelineItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    }

    const milestones = [
        {
            year: "2018",
            title: "The Beginning",
            description: "Poppy Pie was founded with a vision to create a different kind of marketing agency, one that combined strategic thinking with creative execution."
        },
        {
            year: "2020",
            title: "Digital Transformation",
            description: "We expanded our services to include digital marketing solutions, helping businesses navigate the rapidly evolving online landscape."
        },
        {
            year: "2022",
            title: "AI Integration",
            description: "Poppy Pie introduced AI-powered marketing tools, setting new standards for data-driven marketing strategies and automation."
        },
        {
            year: "2023",
            title: "Global Expansion",
            description: "Opened new offices and established partnerships across multiple regions, expanding our reach to serve clients worldwide."
        },
        {
            year: "2025",
            title: "Innovation Hub",
            description: "Launched our Innovation Hub, a dedicated space for exploring emerging technologies and developing cutting-edge marketing solutions."
        }
    ]

    return (
        <section className="py-16 sm:py-20 md:py-24 bg-white">
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
                            Our Journey
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                            From our humble beginnings to becoming a leading marketing agency, our story is one of passion, innovation, and dedication.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                        <div className="lg:col-span-2 order-2 lg:order-1">
                            <motion.div
                                className="relative h-[400px] md:h-[500px] lg:h-full min-h-[400px] w-full rounded-xl overflow-hidden shadow-lg"
                                variants={itemVariants}
                            >
                                <Image
                                    src="/placeholder.svg"
                                    alt="Poppy Pie Company History"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                    data-placeholder="history-image"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <p className="text-sm uppercase tracking-wider mb-1 opacity-80">Founded in</p>
                                    <p className="text-3xl sm:text-4xl font-bold">2018</p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-3 order-1 lg:order-2">
                            <motion.div
                                className="relative pl-6 border-l-2 border-gray-200"
                                variants={timelineVariants}
                            >
                                {milestones.map((milestone, index) => (
                                    <motion.div
                                        key={index}
                                        className="mb-10 last:mb-0 relative"
                                        variants={timelineItemVariants}
                                    >
                                        <div className="absolute -left-[25px] top-0 w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                                            <span className="text-gray-800 font-bold text-sm">{milestone.year}</span>
                                        </div>
                                        <div className="pt-1 pl-4">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{milestone.title}</h3>
                                            <p className="text-gray-600">{milestone.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        className="mt-16 sm:mt-20 text-center"
                        variants={itemVariants}
                    >
                        <blockquote className="text-xl sm:text-2xl italic text-gray-600 max-w-3xl mx-auto">
                            &quot;Our history is just the beginning. We&apos;re constantly evolving and adapting to meet the changing needs of our clients and the market.&quot;
                            <footer className="mt-4 text-base text-gray-500 font-normal not-italic">
                                — Poppy Pie Leadership Team
                            </footer>
                        </blockquote>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default CompanyHistory