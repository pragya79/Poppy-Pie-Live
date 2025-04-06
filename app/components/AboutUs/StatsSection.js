"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"

const StatsSection = () => {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.5 })

    // State for animated counters
    const [counts, setCounts] = useState({
        clients: 0,
        projects: 0,
        awards: 0
    })

    // Target values
    const targetCounts = {
        clients: 150,
        projects: 500,
        awards: 35
    }

    // Animate counters when in view
    useEffect(() => {
        if (isInView) {
            // Duration in milliseconds
            const duration = 2000
            const frameRate = 1000 / 60 // 60fps
            const totalFrames = Math.round(duration / frameRate)
            let frame = 0

            const timer = setInterval(() => {
                frame++
                const progress = frame / totalFrames

                // Easing function (ease-out cubic)
                const eased = 1 - Math.pow(1 - progress, 3)

                setCounts({
                    clients: Math.round(eased * targetCounts.clients),
                    projects: Math.round(eased * targetCounts.projects),
                    awards: Math.round(eased * targetCounts.awards)
                })

                if (frame === totalFrames) {
                    clearInterval(timer)
                }
            }, frameRate)

            return () => clearInterval(timer)
        }
    }, [isInView])

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

    return (
        <section className="py-16 sm:py-20 md:py-24 bg-gray-800 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <pattern id="grid-stats" width="8" height="8" patternUnits="userSpaceOnUse">
                            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid-stats)" />
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
                            Our Impact by the Numbers
                        </h2>
                        <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
                            Results that speak for themselves. We&apos;ve helped businesses across industries achieve remarkable growth.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                        {[
                            { label: "Happy Clients", value: counts.clients, suffix: "+", icon: "👥" },
                            { label: "Projects Completed", value: counts.projects, suffix: "+", icon: "🏆" },
                            { label: "Awards Won", value: counts.awards, suffix: "", icon: "🎯" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 text-center"
                                variants={itemVariants}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <div className="mb-4 text-4xl">{stat.icon}</div>
                                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                                    {stat.value}{stat.suffix}
                                </div>
                                <p className="text-sm sm:text-base text-gray-300">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="mt-12 sm:mt-16 text-center"
                        variants={itemVariants}
                    >
                        <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
                            Our commitment to excellence has led to lasting partnerships and measurable results for all our clients.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default StatsSection