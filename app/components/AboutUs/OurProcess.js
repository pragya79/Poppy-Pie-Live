"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
    Search,
    BarChart,
    PenTool,
    Layout,
    Zap
} from "lucide-react"

const OurProcess = () => {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
    const [activeStep, setActiveStep] = useState(null)

    // Process steps data with monochrome colors
    const processSteps = [
        {
            id: 1,
            title: "Discovery",
            description: "We dive deep to understand your business, goals, target audience, and competitive landscape.",
            details: "Our discovery process involves thorough research, stakeholder interviews, and market analysis to build a solid foundation for your strategy. We identify opportunities, challenges, and key differentiators that will shape our approach.",
            icon: <Search className="h-6 w-6" />,
            color: "bg-gray-100 text-gray-900 border-gray-200"
        },
        {
            id: 2,
            title: "Strategy",
            description: "We develop a tailored plan that aligns with your business objectives and target audience.",
            details: "Based on insights gathered during discovery, we craft a comprehensive strategy that outlines key messaging, channel selection, tactical approaches, and measurement frameworks. Our strategies are data-informed, creative, and focused on driving measurable results.",
            icon: <BarChart className="h-6 w-6" />,
            color: "bg-gray-200 text-gray-900 border-gray-300"
        },
        {
            id: 3,
            title: "Creation",
            description: "Our creative team brings your strategy to life through compelling design and content.",
            details: "This is where strategy meets creativity. Our multidisciplinary team of designers, writers, and developers collaborate to create impactful assets that communicate your brand message effectively. We prioritize quality, creativity, and adherence to brand guidelines throughout the creation process.",
            icon: <PenTool className="h-6 w-6" />,
            color: "bg-gray-300 text-gray-900 border-gray-400"
        },
        {
            id: 4,
            title: "Implementation",
            description: "We execute the strategy across relevant channels and platforms with precision.",
            details: "With a detailed implementation plan, we roll out campaigns and initiatives across selected channels. Our execution is methodical, with proper tracking set up to monitor performance from day one. We coordinate all aspects of the launch to ensure a seamless experience.",
            icon: <Layout className="h-6 w-6" />,
            color: "bg-gray-200 text-gray-900 border-gray-300"
        },
        {
            id: 5,
            title: "Optimization",
            description: "We continuously analyze performance data and make informed improvements.",
            details: "Marketing is never static. We continuously monitor key performance indicators, gather feedback, and analyze results to identify optimization opportunities. Through A/B testing and iterative enhancements, we refine the strategy to maximize ROI and achieve better outcomes over time.",
            icon: <Zap className="h-6 w-6" />,
            color: "bg-gray-100 text-gray-900 border-gray-200"
        }
    ]

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

    const detailsVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    }

    const handleStepClick = (id) => {
        setActiveStep(activeStep === id ? null : id)
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
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Process
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                            A systematic approach that delivers consistent results for our clients
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Process steps timeline */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

                        <div className="space-y-8 md:space-y-0 relative">
                            {processSteps.map((step, index) => (
                                <motion.div
                                    key={step.id}
                                    className="relative"
                                    variants={itemVariants}
                                >
                                    <div className={`md:flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                                        <div className="flex-1 mb-4 md:mb-0">
                                            <motion.div
                                                className={`rounded-xl border p-6 sm:p-8 cursor-pointer transition-all ${step.color} ${activeStep === step.id ? 'shadow-md' : 'shadow-sm'}`}
                                                onClick={() => handleStepClick(step.id)}
                                                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                                            >
                                                <div className="flex items-start">
                                                    <div className="rounded-full bg-white p-2 mr-4 flex items-center justify-center">
                                                        {step.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg sm:text-xl font-bold mb-2 flex items-center">
                                                            {step.title}
                                                            <span className="ml-2 text-sm bg-white/50 rounded-full h-6 w-6 flex items-center justify-center">
                                                                {step.id}
                                                            </span>
                                                        </h3>
                                                        <p className="text-gray-700">{step.description}</p>

                                                        <AnimatePresence>
                                                            {activeStep === step.id && (
                                                                <motion.div
                                                                    variants={detailsVariants}
                                                                    initial="hidden"
                                                                    animate="visible"
                                                                    exit="hidden"
                                                                    className="mt-4 text-gray-700 overflow-hidden"
                                                                >
                                                                    <p>{step.details}</p>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                        <div className="flex-1 hidden md:block"></div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        className="mt-12 sm:mt-16 text-center"
                        variants={itemVariants}
                    >
                        <p className="text-gray-600 italic max-w-2xl mx-auto">
                            &quot;Our process is designed to be both structured and flexible, allowing us to adapt to the unique needs of each client while maintaining a consistent approach to achieving results.&quot;
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default OurProcess