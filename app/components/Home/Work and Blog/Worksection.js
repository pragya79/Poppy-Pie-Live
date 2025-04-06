"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { gsap } from "gsap"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useMediaQuery } from "react-responsive"

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

const Card = ({ item, cardRef, isTilted, index, screenSize }) => {
    // Get responsive card dimensions
    const getCardDimensions = () => {
        switch (screenSize) {
            case "xs":
                return { width: 200, height: 240, padding: 12, fontSize: "text-base", descSize: "text-xs" }
            case "sm":
                return { width: 220, height: 260, padding: 16, fontSize: "text-lg", descSize: "text-sm" }
            case "md":
                return { width: 240, height: 270, padding: 16, fontSize: "text-lg", descSize: "text-sm" }
            case "lg":
                return { width: 256, height: 280, padding: 16, fontSize: "text-lg", descSize: "text-sm" }
            case "xl":
                return { width: 280, height: 300, padding: 20, fontSize: "text-lg", descSize: "text-sm" }
            default:
                return { width: 240, height: 270, padding: 16, fontSize: "text-lg", descSize: "text-sm" }
        }
    }

    const dimensions = getCardDimensions()

    // Adjust tilt effects based on screen size
    const getTiltValues = () => {
        if (screenSize === "xs" || screenSize === "sm") {
            return {
                rotateY: 10,
                perspective: 600,
                scale: 1.03,
                shadowIntensity: "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)"
            }
        } else {
            return {
                rotateY: 15,
                perspective: 800,
                scale: 1.05,
                shadowIntensity: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
            }
        }
    }

    const tiltValues = getTiltValues()

    // Use useEffect to apply GSAP animations when isTilted changes
    useEffect(() => {
        if (cardRef.current) {
            gsap.to(cardRef.current, {
                rotateY: isTilted ? tiltValues.rotateY : 0,
                perspective: isTilted ? tiltValues.perspective : 0,
                transformOrigin: "center center",
                scale: isTilted ? tiltValues.scale : 1,
                zIndex: isTilted ? 10 : index,
                boxShadow: isTilted
                    ? tiltValues.shadowIntensity
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                duration: 0.5,
                ease: "power2.out",
            })
        }
    }, [isTilted, cardRef, index, tiltValues])

    return (
        <div
            ref={cardRef}
            className="relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl bg-white"
            style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                margin: `0 ${dimensions.padding / 2}px`,
                transformStyle: "preserve-3d",
                perspective: "1000px"
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20 z-10"></div>
            <div className="relative w-full h-1/2">
                <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    sizes={`(max-width: 480px) 200px, (max-width: 768px) 220px, 280px`}
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
            </div>
            <div className="p-3 sm:p-4 relative z-20 h-1/2 flex flex-col justify-between">
                <h3 className={`font-semibold text-black ${dimensions.fontSize}`}>{item.title}</h3>
                <p className={`${dimensions.descSize} text-gray-600 mt-1 line-clamp-2`}>{item.description}</p>
            </div>
        </div>
    )
}

const Carousel = ({ data, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const carouselRef = useRef(null)
    const carouselContainerRef = useRef(null)
    const cardRefs = useRef(data.map(() => React.createRef()))

    // Screen size detection
    const isExtraSmall = useMediaQuery({ maxWidth: 479 })
    const isSmall = useMediaQuery({ minWidth: 480, maxWidth: 639 })
    const isMedium = useMediaQuery({ minWidth: 640, maxWidth: 767 })
    const isLarge = useMediaQuery({ minWidth: 768, maxWidth: 1023 })
    const isExtraLarge = useMediaQuery({ minWidth: 1024 })

    // Derive screen size for more precise control
    const screenSize = isExtraSmall ? "xs" : isSmall ? "sm" : isMedium ? "md" : isLarge ? "lg" : "xl"

    // Dynamically determine visible cards based on screen size
    const getVisibleCards = useCallback(() => {
        switch (screenSize) {
            case "xs": return 1;
            case "sm": return 2;
            case "md": return 2;
            case "lg": return 3;
            case "xl": return 4;
            default: return 3;
        }
    }, [screenSize]);

    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, data.length - visibleCards);

    // Get card spacing based on screen size
    const getCardSpacing = useCallback(() => {
        switch (screenSize) {
            case "xs": return 8;  // 8px on extra small screens
            case "sm": return 12; // 12px on small screens
            case "md": return 16; // 16px on medium screens
            default: return 24;   // 24px on large and extra large screens
        }
    }, [screenSize]);

    // Get card width based on screen size
    const getCardWidth = useCallback(() => {
        switch (screenSize) {
            case "xs": return 200;
            case "sm": return 220;
            case "md": return 240;
            case "lg": return 256;
            case "xl": return 280;
            default: return 240;
        }
    }, [screenSize]);

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    }

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }

    // Smooth navigation directly to dot index
    const handleDotClick = (index) => {
        setCurrentIndex(index);
    }

    // Touch handling for swipe gestures
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    }

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    }

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (Math.abs(diff) > minSwipeDistance) {
            if (diff > 0) {
                // Swiped left, go next
                handleNext();
            } else {
                // Swiped right, go prev
                handlePrev();
            }
        }
    }

    // Calculate container width for GSAP animation target
    const calculateContainerWidth = useCallback(() => {
        if (!carouselContainerRef.current) return 0;
        return carouselContainerRef.current.offsetWidth;
    }, []);

    // GSAP animation for the carousel
    useEffect(() => {
        const cardWidth = getCardWidth();
        const cardSpacing = getCardSpacing();

        if (carouselRef.current) {
            gsap.to(carouselRef.current, {
                x: -currentIndex * (cardWidth + cardSpacing),
                duration: 0.6,
                ease: "power2.out",
            });
        }
    }, [currentIndex, getCardWidth, getCardSpacing]);

    // Update carousel position on resize
    useEffect(() => {
        const handleResize = () => {
            const cardWidth = getCardWidth();
            const cardSpacing = getCardSpacing();

            if (carouselRef.current) {
                // Immediately update position on resize without animation
                gsap.set(carouselRef.current, {
                    x: -currentIndex * (cardWidth + cardSpacing),
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentIndex, getCardWidth, getCardSpacing]);

    // Function to determine if card should be tilted
    const isTilted = (index) => {
        return index - currentIndex === visibleCards;
    }

    // Determine dot display type based on screen size and number of slides
    const getDotDisplayType = () => {
        // For extra small screens or if there are many slides, use numbered dots
        if (screenSize === "xs" || maxIndex > 8) {
            return "numbered";
        } else {
            return "dots";
        }
    };

    const dotDisplayType = getDotDisplayType();

    return (
        <div className="w-full mx-auto mb-8 sm:mb-12 md:mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-2 sm:mb-0">{title}</h2>

                <div className="flex items-center">
                    {dotDisplayType === "dots" ? (
                        <div className="flex space-x-1.5 sm:space-x-2">
                            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleDotClick(i)}
                                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-300 ${currentIndex === i ? "bg-black" : "bg-gray-300"
                                        }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm font-medium text-gray-500">
                            {currentIndex + 1} / {maxIndex + 1}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile swipe indicator - only shown on xs and sm screens */}
            {(screenSize === "xs" || screenSize === "sm") && (
                <div className="flex items-center justify-center mb-3 text-sm text-gray-500">
                    <span className="inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Swipe to browse</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                </div>
            )}

            <div
                className="relative"
                ref={carouselContainerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Navigation Buttons - Hide on smallest screens where touch is primary */}
                <button
                    onClick={handlePrev}
                    className={`absolute -left-2 sm:-left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black ${currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                        } ${screenSize === "xs" ? "hidden sm:flex" : "flex"}`}
                    disabled={currentIndex === 0}
                    aria-label="Previous items"
                >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </button>

                {/* Cards Container */}
                <div className="overflow-hidden py-4 sm:py-6 px-4 sm:px-8 md:px-12">
                    <div
                        ref={carouselRef}
                        className="flex"
                        style={{
                            willChange: "transform",
                            paddingLeft: screenSize === "xs" ? "50%" : screenSize === "sm" ? "25%" : "0%",
                            transform: "translateX(0px)" // Initial transform for GSAP to modify
                        }}
                    >
                        {data.map((item, index) => (
                            <Card
                                key={item.id}
                                item={item}
                                cardRef={cardRefs.current[index]}
                                isTilted={isTilted(index)}
                                index={index}
                                screenSize={screenSize}
                            />
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleNext}
                    className={`absolute -right-2 sm:-right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black ${currentIndex >= maxIndex ? "opacity-50 cursor-not-allowed" : ""
                        } ${screenSize === "xs" ? "hidden sm:flex" : "flex"}`}
                    disabled={currentIndex >= maxIndex}
                    aria-label="Next items"
                >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </button>
            </div>
        </div>
    )
}

// Main component with both carousels
const DualCarouselSection = () => {
    // Screen size detection for section styling
    const isSmall = useMediaQuery({ maxWidth: 639 })

    return (
        <section className="min-h-screen bg-gray-50 py-8 sm:py-12 md:py-16 px-3 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 sm:mb-12 md:mb-16">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4">Our Portfolio</h1>
                    <div className="w-16 sm:w-20 h-1 bg-black mx-auto"></div>
                </div>

                <Carousel data={workData} title="Our Work" />
                <Carousel data={blogData} title="Our Blogs" />
            </div>
        </section>
    )
}

export default DualCarouselSection