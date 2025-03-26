"use client"

import React, { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

// Sample data for our work and blogs
const workData = [
    {
        id: 1,
        title: "Project 1",
        image: "/placeholder.svg?height=300&width=400",
        description: "Description for Project 1",
    },
    {
        id: 2,
        title: "Project 2",
        image: "/placeholder.svg?height=300&width=400",
        description: "Description for Project 2",
    },
    {
        id: 3,
        title: "Project 3",
        image: "/placeholder.svg?height=300&width=400",
        description: "Description for Project 3",
    },
    {
        id: 4,
        title: "Project 4",
        image: "/placeholder.svg?height=300&width=400",
        description: "Description for Project 4",
    },
    {
        id: 5,
        title: "Project 5",
        image: "/placeholder.svg?height=300&width=400",
        description: "Description for Project 5",
    },
    {
        id: 6,
        title: "Project 6",
        image: "/placeholder.svg?height=300&width=400",
        description: "Description for Project 6",
    },
]

const blogData = [
    {
        id: 1,
        title: "Blog Post 1",
        image: "/placeholder.svg?height=300&width=400",
        description: "Description for Blog Post 1",
    },
    {
        id: 2,
        title: "Blog Post 2",
        image: "/placeholder.svg?height=300&width=400",
        description: "Description for Blog Post 2",
    },
    {
        id: 3,
        title: "Blog Post 3",
        image: "/placeholder.svg?height=300&width=400",
        description: "Description for Blog Post 3",
    },
    {
        id: 4,
        title: "Blog Post 4",
        image: "/placeholder.svg?height=300&width=400",
        description: "Description for Blog Post 4",
    },
    {
        id: 5,
        title: "Blog Post 5",
        image: "/placeholder.svg?height=300&width=400",
        description: "Description for Blog Post 5",
    },
    {
        id: 6,
        title: "Blog Post 6",
        image: "/placeholder.svg?height=300&width=400",
        description: "Description for Blog Post 6",
    },
]

const Card = ({ item, cardRef, isTilted, index }) => {
    // Use useEffect to apply GSAP animations when isTilted changes
    useEffect(() => {
        if (cardRef.current) {
            gsap.to(cardRef.current, {
                rotateY: isTilted ? 15 : 0,  // Rotate on Y axis for perspective effect
                perspective: isTilted ? 800 : 0, // Add perspective for 3D effect
                transformOrigin: "center center", // Ensure rotation happens from center
                scale: isTilted ? 1.05 : 1,
                zIndex: isTilted ? 10 : index,
                boxShadow: isTilted
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                duration: 0.5,
                ease: "power2.out",
            })
        }
    }, [isTilted, cardRef, index])

    return (
        <div
            ref={cardRef}
            className="relative flex-shrink-0 w-64 h-72 mx-3 bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"  // Add this to parent for better 3D effect
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20 z-10"></div>
            <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="w-full h-40 object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
            <div className="p-4 relative z-20">
                <h3 className="text-lg font-semibold text-black">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
            </div>
        </div>
    )
}

const Carousel = ({ data, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const visibleCards = 3 // Show 3 cards at once
    const maxIndex = Math.max(0, data.length - visibleCards)

    // Refs for all cards
    const cardRefs = useRef(data.map(() => React.createRef()))

    const handleNext = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
    }

    // GSAP animation for the carousel
    const carouselRef = useRef(null)

    useEffect(() => {
        if (carouselRef.current) {
            gsap.to(carouselRef.current, {
                x: -currentIndex * (256 + 24), // card width + margin
                duration: 0.6,
                ease: "power2.out",
            })
        }
    }, [currentIndex])

    // Calculate which card should be tilted - always the 4th card in the sequence
    const isTilted = (index) => {
        // The 4th card in the visible sequence (index 3) should be tilted
        return index - currentIndex === 3
    }

    return (
        <div className="w-full max-w-7xl mx-auto mb-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-black">{title}</h2>

                <div className="flex space-x-2">
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${currentIndex === i ? "bg-black" : "bg-gray-300"
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>

            <div className="relative">
                {/* Navigation Buttons */}
                <button
                    onClick={handlePrev}
                    className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                    aria-label="Previous items"
                >
                    <ChevronLeft className="w-5 h-5 text-black" />
                </button>

                {/* Cards Container */}
                <div className="overflow-hidden py-6 px-12">
                    <div ref={carouselRef} className="flex" style={{ willChange: "transform" }}>
                        {data.map((item, index) => (
                            <Card
                                key={item.id}
                                item={item}
                                cardRef={cardRefs.current[index]}
                                isTilted={isTilted(index)}
                                index={index}
                            />
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleNext}
                    className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                    aria-label="Next items"
                >
                    <ChevronRight className="w-5 h-5 text-black" />
                </button>
            </div>
        </div>
    )
}

// Main component with both carousels
const DualCarouselSection = () => {
    return (
        <section className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-black mb-4">Our Portfolio</h1>
                    <div className="w-20 h-1 bg-black mx-auto"></div>
                </div>

                <Carousel data={workData} title="Our Work" />
                <Carousel data={blogData} title="Our Blogs" />
            </div>
        </section>
    )
}

export default DualCarouselSection