"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import CareerHero from "./CareerHero"
import CareerForm from "./CareerForm"
import PositionsList from "./PositionsList"
import CareerFAQs from "./CareerFAQs"
import CareerValues from "./CareerValues"

const Careers = () => {
    // Refs for scroll animations
    const formRef = useRef(null)
    const positionsRef = useRef(null)
    const valuesRef = useRef(null)
    const faqRef = useRef(null)

    // Animation triggers - use smaller amount values for earlier triggering
    const isFormInView = useInView(formRef, { once: true, amount: 0.1 })
    const isPositionsInView = useInView(positionsRef, { once: true, amount: 0.1 })
    const isValuesInView = useInView(valuesRef, { once: true, amount: 0.1 })
    const isFaqInView = useInView(faqRef, { once: true, amount: 0.1 })

    // Animation variants
    const fadeIn = {
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

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <CareerHero />

            <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
                {/* Open Positions Section */}
                <motion.section
                    ref={positionsRef}
                    className="mb-16 sm:mb-20"
                    initial="hidden"
                    animate={isPositionsInView ? "visible" : "hidden"}
                    variants={fadeIn}
                >
                    <PositionsList />
                </motion.section>

                {/* Modified layout: Flex instead of Grid for better height handling */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                    {/* Form section - adjust width for lg screens */}
                    <motion.div
                        ref={formRef}
                        className="lg:w-3/5 bg-white rounded-xl shadow-md p-6 sm:p-8 self-start"
                        initial="hidden"
                        animate={isFormInView ? "visible" : "hidden"}
                        variants={fadeIn}
                        id="application-form"
                    >
                        <CareerForm />
                    </motion.div>

                    {/* Values and Culture Section - adjust width for lg screens */}
                    <motion.div
                        ref={valuesRef}
                        className="lg:w-2/5 space-y-6 self-start"
                        initial="hidden"
                        animate={isValuesInView ? "visible" : "hidden"}
                        variants={staggerContainer}
                    >
                        <CareerValues />
                    </motion.div>
                </div>

                {/* FAQ Section */}
                <motion.section
                    ref={faqRef}
                    className="mt-16 sm:mt-20"
                    initial="hidden"
                    animate={isFaqInView ? "visible" : "hidden"}
                    variants={fadeIn}
                >
                    <CareerFAQs />
                </motion.section>
            </div>
        </div>
    )
}

export default Careers