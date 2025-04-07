"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const Accordion = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState(null)

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    // Animation variants for smooth opening/closing
    const contentVariants = {
        hidden: {
            height: 0,
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: [0.33, 1, 0.68, 1] // Custom cubic-bezier for smoother motion
            }
        },
        visible: {
            height: "auto",
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: [0.33, 1, 0.68, 1]
            }
        }
    }

    const iconVariants = {
        closed: { rotate: 0 },
        open: { rotate: 180 }
    }

    return (
        <div className="w-full">
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className="border-b border-gray-200 last:border-b-0"
                >
                    <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full py-4 px-0 flex justify-between items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                        aria-expanded={activeIndex === index}
                        aria-controls={`accordion-content-${item.id}`}
                    >
                        <span className="font-medium text-gray-900 hover:text-gray-600 transition-colors">
                            {item.question}
                        </span>
                        <motion.div
                            variants={iconVariants}
                            initial="closed"
                            animate={activeIndex === index ? "open" : "closed"}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0 text-gray-500"
                        >
                            <ChevronDown size={18} />
                        </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                        {activeIndex === index && (
                            <motion.div
                                id={`accordion-content-${item.id}`}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={contentVariants}
                                className="overflow-hidden"
                            >
                                <div className="py-3 pb-5 text-gray-600">
                                    {item.answer}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    )
}

export default Accordion