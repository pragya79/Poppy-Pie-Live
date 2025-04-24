"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const CareerHero = () => {
    // Ref for scroll animation
    const headerRef = useRef(null)

    // Animation trigger
    const isHeaderInView = useInView(headerRef, { once: true })

    // Animation variants
    const staggerContainer = {
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
        <section className="relative bg-gray-900 text-white overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <defs>
                        <pattern
                            id="grid"
                            width="8"
                            height="8"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M 8 0 L 0 0 0 8"
                                fill="none"
                                stroke="white"
                                strokeWidth="0.5"
                            />
                        </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                </svg>
            </div>

            {/* Hero content */}
            <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-24 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        ref={headerRef}
                        initial="hidden"
                        animate={isHeaderInView ? "visible" : "hidden"}
                        variants={staggerContainer}
                    >
                        <motion.h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
                            variants={itemVariants}
                        >
                            Join Our Team
                        </motion.h1>
                        <motion.p
                            className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto"
                            variants={itemVariants}
                        >
                            Build your career with a team that values innovation, creativity, and results-driven marketing solutions.
                        </motion.p>
                        <motion.div
                            variants={itemVariants}
                            className="flex justify-center gap-4 flex-wrap"
                        >
                            <Button
                                size="lg"
                                className="bg-white text-gray-900 hover:bg-gray-100"
                                onClick={() => {
                                    const element = document.getElementById('application-form');
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Apply Now
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-transparent text-white border-white hover:bg-white/50 hover:text-black/95"
                                asChild
                            >
                                <Link href="#open-positions">View Open Positions</Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Curved bottom edge */}
            <div className="hidden md:block absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 120"
                    className="w-full h-[40px] xs:h-[50px] sm:h-[60px] md:h-[80px] lg:h-[100px] xl:h-[120px] relative block"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="#f9fafb"
                        fillOpacity="1"
                        d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                    ></path>
                </svg>
            </div>
        </section>
    )
}

export default CareerHero