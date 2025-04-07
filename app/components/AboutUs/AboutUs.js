"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

// Import components
import TeamSection from "@/app/components/AboutUs/TeamSection"
import MissionVision from "@/app/components/AboutUs/MissionVision"
import CompanyHistory from "@/app/components/AboutUs/CompanyHistory"
import OurProcess from "@/app/components/AboutUs/OurProcess"
import FeaturedWork from "@/app/components/AboutUs/FeaturedWork"
import TestimonialsSlider from "@/app/components/AboutUs/TestimonialsSlider"
import StatsSection from "@/app/components/AboutUs/StatsSection"
import ClientLogos from "@/app/components/AboutUs/ClientLogos"

const AboutUs = () => {
    // Refs for scroll animations
    const headerRef = useRef(null)
    const heroRef = useRef(null)
    const ctaRef = useRef(null)

    // Animation triggers
    const isHeaderInView = useInView(headerRef, { once: true })
    const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
    const isCtaInView = useInView(ctaRef, { once: true, amount: 0.5 })

    // Detect if scrolled
    const [hasScrolled, setHasScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY
            setHasScrolled(scrollPosition > 50)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

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

    const heroImageVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gray-900 text-white overflow-hidden">
                {/* Background pattern - made responsive */}
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
                                className="pattern-grid"
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

                {/* Hero content with improved responsive padding */}
                <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 relative z-10">
                    <div className="max-w-screen-xl mx-auto">
                        {/* Responsive flex direction and spacing */}
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10 lg:gap-12">
                            {/* Text content - improved responsive text alignment and sizing */}
                            <motion.div
                                ref={heroRef}
                                className="w-full lg:w-1/2 text-center lg:text-left"
                                initial="hidden"
                                animate={isHeroInView ? "visible" : "hidden"}
                                variants={staggerContainer}
                            >
                                <motion.h1
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
                                    variants={fadeIn}
                                >
                                    Building brands,
                                    <span className="block sm:inline sm:ml-2 text-gray-300">Crafting experiences</span>
                                </motion.h1>

                                <motion.p
                                    className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0"
                                    variants={fadeIn}
                                >
                                    At Poppy Pie, we combine creative vision with strategic thinking to elevate brands and drive sustainable growth for businesses of all sizes.
                                </motion.p>

                                {/* Responsive button layout */}
                                <motion.div
                                    className="flex flex-wrap gap-4 justify-center lg:justify-start"
                                    variants={fadeIn}
                                >
                                    <Link href="/contact-us">
                                        <motion.button
                                            className="bg-white text-gray-900 hover:bg-gray-100 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:w-auto"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Work With Us
                                        </motion.button>
                                    </Link>
                                    <Link href="#our-process">
                                        <motion.button
                                            className="border border-white text-white hover:bg-white/10 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:w-auto"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Our Process
                                        </motion.button>
                                    </Link>
                                </motion.div>
                            </motion.div>

                            {/* Image section - improved responsive height and spacing */}
                            <motion.div
                                className="w-full lg:w-1/2 relative mt-8 lg:mt-0"
                                initial="hidden"
                                animate={isHeroInView ? "visible" : "hidden"}
                                variants={heroImageVariants}
                            >
                                <div className="relative h-[250px] xs:h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[450px] w-full rounded-xl overflow-hidden shadow-2xl mx-auto max-w-2xl lg:max-w-none">
                                    <Image
                                        src="/hero/team.jpg"
                                        alt="Poppy Pie Creative Team"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 45vw"
                                        priority
                                        quality={90}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Curved bottom edge - responsive for all screens */}
                <div className="hidden md:flex md:absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0]">
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

            <div className="theme-monochrome">
                <MissionVision />
            </div>

            {/* Company History - Commented out in original */}
            {/* <CompanyHistory /> */}

            <div className="theme-monochrome">
                {/* <StatsSection />  will use it when we have stats data */}
            </div>

            <div id="our-process" className="theme-monochrome">
                <OurProcess />
            </div>

            <div className="theme-monochrome">
                <TeamSection />
            </div>

            <div className="theme-monochrome">
                <FeaturedWork />
            </div>

            <div className="theme-monochrome">
                <TestimonialsSlider />
            </div>

            <div className="theme-monochrome">
                <ClientLogos />
            </div>

            {/* CTA Section */}
            <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6">
                <div
                    ref={ctaRef}
                    className="max-w-4xl mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-xl"
                >
                    <motion.div
                        className="relative p-8 sm:p-10 md:p-12"
                        initial="hidden"
                        animate={isCtaInView ? "visible" : "hidden"}
                        variants={fadeIn}
                    >
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <pattern id="grid-cta" width="8" height="8" patternUnits="userSpaceOnUse">
                                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
                                    </pattern>
                                </defs>
                                <rect width="100" height="100" fill="url(#grid-cta)" />
                            </svg>
                        </div>

                        <div className="relative z-10 text-center">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                                Ready to elevate your brand?
                            </h2>
                            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
                                Let&apos;s create something extraordinary together. Our team is ready to transform your vision into reality.
                            </p>
                            <Link href="/contact-us">
                                <motion.button
                                    className="bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base inline-flex items-center"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Get in Touch
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default AboutUs