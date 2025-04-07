"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const TestimonialsSlider = () => {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
    const [activeIndex, setActiveIndex] = useState(0)
    const [autoplay, setAutoplay] = useState(true)
    const autoplayRef = useRef(null)

    // Testimonials data
    const testimonials = [
        {
            id: 1,
            name: "John Doe",
            role: "CEO, TechVision",
            company: "TechVision",
            content: "Working with Poppy Pie transformed our brand identity and market position. Their strategic approach and creative execution delivered measurable results that exceeded our expectations. The team's ability to understand our vision and translate it into compelling marketing solutions has been invaluable.",
            image: "/images/avatar1.jpg"
        },
        {
            id: 2,
            name: "Sarah Smith",
            role: "Marketing Director",
            company: "EcoLife",
            content: "Poppy Pie helped us navigate a complex rebranding process with exceptional skill and insight. Their team took the time to truly understand our business objectives and audience, resulting in a brand strategy that has resonated deeply with our customers and significantly improved our market position.",
            image: "/images/avatar2.jpg"
        },
        {
            id: 3,
            name: "Alex Johnson",
            role: "Founder",
            company: "StyleCo",
            content: "The expertise and creativity that Poppy Pie brings to the table is unmatched. They revamped our entire digital presence, resulting in a 156% increase in conversions and substantially improved user experience. Their data-driven approach combined with innovative design has been a game-changer for our business.",
            image: "/images/avatar3.jpg"
        },
        {
            id: 4,
            name: "Lisa Chen",
            role: "Head of Growth",
            company: "FinanceHub",
            content: "From strategy development to execution, Poppy Pie delivered excellence at every step. Their content marketing strategy helped us establish thought leadership in a competitive industry and significantly increased our qualified leads. The team is responsive, creative, and truly dedicated to our success.",
            image: "/images/avatar4.jpg"
        }
    ]

    // Handle autoplay
    useEffect(() => {
        if (autoplay) {
            autoplayRef.current = setInterval(() => {
                setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
            }, 8000)
        }

        return () => {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current)
            }
        }
    }, [autoplay, testimonials.length])

    // Pause autoplay on hover
    const handleMouseEnter = () => setAutoplay(false)
    const handleMouseLeave = () => setAutoplay(true)

    // Navigation handlers
    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
        setAutoplay(false)
    }

    const handleNext = () => {
        setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
        setAutoplay(false)
    }

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

    const slideVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            x: -50,
            transition: {
                duration: 0.3,
                ease: "easeIn"
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
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <motion.div className="text-center mb-12 sm:mb-16" variants={itemVariants}>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What Our Clients Say
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                            Don&apos;t just take our word for it — hear from some of our satisfied clients
                        </p>
                    </motion.div>

                    <div className="relative bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10 overflow-hidden">
                        {/* Quote icon */}
                        <div className="absolute top-6 right-6 text-gray-200">
                            <Quote size={60} />
                        </div>

                        <div className="relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    variants={slideVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12"
                                >
                                    <div className="md:col-span-1 flex flex-col items-center md:items-start">
                                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg mb-4">
                                            <Image
                                                src={testimonials[activeIndex].image || "/placeholder.svg"}
                                                alt={testimonials[activeIndex].name}
                                                fill
                                                className="object-cover grayscale"
                                                sizes="(max-width: 768px) 96px, 96px"
                                                data-placeholder={`testimonial-${testimonials[activeIndex].id}`}
                                            />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center md:text-left">
                                            {testimonials[activeIndex].name}
                                        </h3>
                                        <p className="text-gray-600 text-center md:text-left">{testimonials[activeIndex].role}</p>
                                        <p className="text-gray-600 font-medium text-center md:text-left">
                                            {testimonials[activeIndex].company}
                                        </p>
                                    </div>

                                    <div className="md:col-span-4 flex items-center">
                                        <blockquote className="text-lg sm:text-xl text-gray-700 italic">
                                            &quot;{testimonials[activeIndex].content}&quot;
                                        </blockquote>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation controls */}
                        <div className="flex justify-between items-center mt-8 sm:mt-10">
                            <div className="flex space-x-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveIndex(index)}
                                        className={`w-2.5 h-2.5 rounded-full transition-colors ${index === activeIndex ? 'bg-gray-900' : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                        aria-label={`Go to testimonial ${index + 1}`}
                                    />
                                ))}
                            </div>

                            <div className="flex space-x-3">
                                <motion.button
                                    onClick={handlePrev}
                                    className="p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Previous testimonial"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </motion.button>
                                <motion.button
                                    onClick={handleNext}
                                    className="p-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Next testimonial"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default TestimonialsSlider