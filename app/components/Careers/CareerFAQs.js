"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Info } from "lucide-react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const CareerFAQs = () => {
    // State for tracking which FAQ is currently active
    const [activeItem, setActiveItem] = useState(null)

    // FAQ items
    const faqItems = [
        {
            id: "faq-1",
            question: "What is the application process like?",
            answer: "Our application process typically involves reviewing your application, a screening call, a skills assessment related to the position, and an interview with the team. We aim to make decisions quickly and keep you informed throughout the process."
        },
        {
            id: "faq-2",
            question: "Do you offer remote work opportunities?",
            answer: "Yes, many of our positions offer remote work options. Some roles may require occasional in-office presence in our Mohali location, while others are fully remote. The job description will specify the work arrangement for each position."
        },
        {
            id: "faq-3",
            question: "What qualifications are you looking for?",
            answer: "Qualifications vary by position, but we generally look for candidates with relevant experience, a passion for marketing, strong communication skills, and alignment with our company values. We value potential and cultural fit as much as formal qualifications."
        },
        {
            id: "faq-4",
            question: "Are there opportunities for career growth?",
            answer: "Absolutely! We're committed to the professional development of our team members. We provide mentoring, training opportunities, and a clear path for advancement as you grow your skills and experience with us."
        },
        {
            id: "faq-5",
            question: "What benefits do you offer?",
            answer: "Our benefits package includes competitive compensation, flexible work arrangements, professional development opportunities, health insurance options, and a collaborative work environment. We continuously evolve our benefits based on team feedback."
        },
        {
            id: "faq-6",
            question: "I don't see a position that matches my skills. Can I still apply?",
            answer: "Yes, we welcome general applications. If you're passionate about marketing and feel you'd be a good fit for our team, submit your application indicating your areas of expertise, and we'll reach out if a suitable position becomes available."
        },
        {
            id: "faq-7",
            question: "How long does it take to hear back after applying?",
            answer: "We review applications on a rolling basis and typically respond within 1-2 weeks. If your application proceeds to the next stage, you'll be contacted for a screening call. Due to the volume of applications, we may not be able to provide individual feedback to all candidates."
        }
    ]

    // Handle accordion value change to update activeItem
    const handleValueChange = (value) => {
        setActiveItem(value);
    }

    // Container animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            }
        }
    }

    // Item animation variants
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
            }
        }
    }

    // Title animation variants
    const titleVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: 0.2
            }
        }
    }

    return (
        <motion.div
            className="max-w-3xl mx-auto py-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div
                className="text-center mb-8"
                variants={titleVariants}
            >
                <motion.h2
                    className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Frequently Asked Questions
                </motion.h2>
                <motion.p
                    className="text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    Answers to common questions about joining our team
                </motion.p>
            </motion.div>

            <Accordion
                type="single"
                collapsible
                className="space-y-4"
                onValueChange={handleValueChange}
            >
                <AnimatePresence>
                    {faqItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            variants={itemVariants}
                            custom={index}
                            layout
                        >
                            <AccordionItem
                                value={item.id}
                                className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                            >
                                <motion.div
                                    whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.8)" }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <AccordionTrigger className="px-6 py-4 text-left font-medium text-gray-900 group">
                                        <motion.span
                                            className="flex-1"
                                            whileHover={{ x: 4 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        >
                                            {item.question}
                                        </motion.span>
                                    </AccordionTrigger>
                                </motion.div>
                                <AccordionContent>
                                    <motion.div
                                        className="px-6 pb-4 pt-2 text-gray-600"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {item.answer}
                                    </motion.div>
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </Accordion>

            <motion.div
                className="mt-10 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    delay: 0.8,
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                }}
            >
                <motion.div
                    className="inline-flex items-center justify-center gap-2 p-4 rounded-lg bg-gray-50"
                    whileHover={{
                        scale: 1.02,
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    }}
                    transition={{ duration: 0.2 }}
                >
                    <Info className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-600">
                        Have a question that&apos;s not answered here? Email us at{" "}
                        <motion.a
                            href="mailto:careers@poppypie.com"
                            className="text-gray-900 font-medium hover:underline"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            careers@poppypie.com
                        </motion.a>
                    </p>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export default CareerFAQs