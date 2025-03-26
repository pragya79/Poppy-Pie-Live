"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { brandingData } from "./Utility"
import Link from "next/link"

export default function InteractiveBrandingModel() {
    const [activeSection, setActiveSection] = useState("visual-identity")
    const svgRef = useRef(null)
    const contentRef = useRef(null)

    // Initialize GSAP animations - only for initial diagram reveal
    useEffect(() => {
        if (!svgRef.current) return

        // Initial animation for the diagram
        gsap.fromTo(
            ".branding-circle",
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, stagger: 0.1, ease: "back.out(1.7)" },
        )

        return () => {
            gsap.killTweensOf(".branding-circle")
        }
    }, [])

    // Update styling when active section changes
    useEffect(() => {
        if (!svgRef.current) return

        // Reset all text elements
        document.querySelectorAll('.branding-text').forEach(el => {
            el.classList.remove('font-bold')
            el.classList.remove('text-gray-900')
            el.classList.add('text-gray-600')
        })

        // Highlight active text element
        const activeElement = document.querySelector(`.text-${activeSection}`)
        if (activeElement) {
            activeElement.classList.add('font-bold')
            activeElement.classList.add('text-gray-900')
            activeElement.classList.remove('text-gray-600')
        }

        // Animate content change
        if (contentRef.current) {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 }
            )
        }
    }, [activeSection])

    const TextSection = ({ id, label, x, y, onClick }) => (
        <g onClick={() => onClick(id)} style={{ cursor: "pointer" }} className={`section-group section-${id}`}>
            <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`
                    branding-text text-${id} font-serif
                    ${id === activeSection ? "text-gray-900 font-bold text-[15px]" : "text-gray-600 text-[13px]"}
                    transition-all duration-300 hover:text-gray-800
                `}
            >
                {label}
            </text>
        </g>
    )

    return (
        <div className="flex flex-col md:flex-row w-full bg-gray-50 rounded-lg overflow-hidden shadow-lg min-h-[800px]">
            <div className="w-full md:w-1/2 bg-gray-100 p-8 flex items-center justify-center">
                <svg ref={svgRef} viewBox="0 0 500 500" className="w-full h-full max-w-xl">
                    {/* Main circles */}
                    <motion.circle
                        cx="250"
                        cy="250"
                        r="220"
                        className="branding-circle"
                        fill="#f5f5f5"
                        stroke="#e0e0e0"
                        strokeWidth="1"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                    <motion.circle
                        cx="250"
                        cy="250"
                        r="150"
                        className="branding-circle"
                        fill="#ebebeb"
                        stroke="#e0e0e0"
                        strokeWidth="1"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    />
                    <motion.circle
                        cx="250"
                        cy="250"
                        r="75"
                        className="branding-circle"
                        fill="#e0e0e0"
                        stroke="#d0d0d0"
                        strokeWidth="1"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    />

                    {/* Center - Logo */}
                    <TextSection id="logo" label="Logo" x="250" y="250" onClick={setActiveSection} />

                    {/* Second ring - Visual Identity */}
                    <TextSection
                        id="visual-identity"
                        label="Visual Identity"
                        x="250"
                        y="175"
                        onClick={setActiveSection}
                    />

                    {/* Elements around Visual Identity */}
                    <TextSection id="typography" label="Typography" x="150" y="325" onClick={setActiveSection} />
                    <TextSection id="colours" label="Colours" x="170" y="210" onClick={setActiveSection} />
                    <TextSection id="layout" label="Layout" x="330" y="210" onClick={setActiveSection} />
                    <TextSection id="imagery" label="Imagery" x="310" y="325" onClick={setActiveSection} />

                    {/* Outer ring - Branding */}
                    <TextSection id="branding" label="Branding" x="250" y="75" onClick={setActiveSection} />

                    {/* Elements around Branding */}
                    <TextSection id="values" label="Values" x="180" y="115" onClick={setActiveSection} />
                    <TextSection
                        id="target-quality-of-products-services"
                        label="Target/Quality"
                        x="320"
                        y="105"
                        onClick={setActiveSection}
                    />
                    <TextSection
                        id="name-of-voice"
                        label="Tone of Voice"
                        x="115"
                        y="160"
                        onClick={setActiveSection}
                    />
                    <TextSection
                        id="business-personal-networking"
                        label="Networking"
                        x="85"
                        y="240"
                        onClick={setActiveSection}
                    />
                    <TextSection
                        id="marketing-approach"
                        label="Marketing"
                        x="100"
                        y="350"
                        onClick={setActiveSection}
                    />
                    <TextSection
                        id="associated-brands"
                        label="Associated Brands"
                        x="195"
                        y="415"
                        onClick={setActiveSection}
                    />
                    <TextSection id="use-of-space" label="Use of Space" x="305" y="415" onClick={setActiveSection} />
                    <TextSection
                        id="communication-channels"
                        label="Communication"
                        x="410"
                        y="350"
                        onClick={setActiveSection}
                    />
                    <TextSection
                        id="business-processes"
                        label="Processes"
                        x="415"
                        y="240"
                        onClick={setActiveSection}
                    />
                    <TextSection
                        id="customer-service-philosophy"
                        label="Customer Service"
                        x="390"
                        y="165"
                        onClick={setActiveSection}
                    />

                    {/* Add connecting lines to visually connect elements */}
                    <g className="connecting-lines" stroke="#e0e0e0" strokeWidth="1" opacity="0.5">
                        {/* Lines from Visual Identity to its elements */}
                        <line x1="250" y1="175" x2="170" y2="210" />
                        <line x1="250" y1="175" x2="330" y2="210" />
                        <line x1="250" y1="175" x2="150" y2="325" />
                        <line x1="250" y1="175" x2="310" y2="325" />

                        {/* Lines from Branding to its elements (outer circle) */}
                        <line x1="250" y1="75" x2="180" y2="115" />
                        <line x1="250" y1="75" x2="320" y2="105" />
                        <line x1="250" y1="75" x2="115" y2="160" />
                        <line x1="250" y1="75" x2="390" y2="165" />

                        {/* Line from Branding to Visual Identity */}
                        <line x1="250" y1="75" x2="250" y2="175" />

                        {/* Line from Visual Identity to Logo */}
                        <line x1="250" y1="175" x2="250" y2="250" />
                    </g>
                </svg>
            </div>

            <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        ref={contentRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex-grow flex flex-col justify-center"
                    >
                        <motion.h2
                            className="text-4xl font-serif mb-6 text-gray-900"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {brandingData[activeSection].title}
                        </motion.h2>
                        <motion.p
                            className="text-xl text-gray-700 mb-8 leading-relaxed w-2xl"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {brandingData[activeSection].description}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>

                <Link href={brandingData[activeSection].url}>
                    <motion.button
                        className="self-start bg-gray-900 hover:bg-gray-800 text-white py-3 px-8 rounded-lg text-lg shadow-lg"
                        whileHover={{ scale: 1.025 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        Know More
                    </motion.button>
                </Link>
            </div>
        </div>
    )
}