"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const CareerFAQs = () => {
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

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <p className="text-gray-600">Answers to common questions about joining our team</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Accordion type="single" collapsible className="space-y-4">
                    {faqItems.map((item) => (
                        <AccordionItem
                            key={item.id}
                            value={item.id}
                            className="border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                        >
                            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-left font-medium text-gray-900">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </motion.div>

            <div className="mt-10 text-center">
                <p className="text-gray-600">
                    Have a question that&apos;s not answered here? Email us at{" "}
                    <a href="mailto:careers@poppypie.com" className="text-gray-900 font-medium hover:underline">
                        careers@poppypie.com
                    </a>
                </p>
            </div>
        </div>
    )
}

export default CareerFAQs