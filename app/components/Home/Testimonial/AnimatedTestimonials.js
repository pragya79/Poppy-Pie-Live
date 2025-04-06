"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useMediaQuery } from "react-responsive" // Add this library or implement your own hook

const AnimatedTestimonials = ({ testimonials }) => {
    const [isRotating, setIsRotating] = useState(false)
    const [autoRotatePaused, setAutoRotatePaused] = useState(false)
    const carouselRef = useRef(null)
    const cardsRef = useRef([])
    const buttonRef = useRef(null)
    const timelineRef = useRef(null)
    const touchStartX = useRef(0)
    const touchStartY = useRef(0)
    const [viewportHeight, setViewportHeight] = useState(0)
    const [orientation, setOrientation] = useState("landscape")

    // Responsive breakpoints using react-responsive
    // You can replace this with a custom hook if you prefer
    const isExtraSmall = useMediaQuery({ maxWidth: 479 })
    const isSmall = useMediaQuery({ minWidth: 480, maxWidth: 639 })
    const isMedium = useMediaQuery({ minWidth: 640, maxWidth: 767 })
    const isLarge = useMediaQuery({ minWidth: 768, maxWidth: 1023 })
    const isExtraLarge = useMediaQuery({ minWidth: 1024 })

    // Derive screen size for more precise control
    const screenSize = isExtraSmall ? "xs" : isSmall ? "sm" : isMedium ? "md" : isLarge ? "lg" : "xl"

    // Instead of tracking indices, we'll track the actual testimonial objects in their positions
    const [positionedTestimonials, setPositionedTestimonials] = useState([...testimonials])

    // Check viewport size and orientation on mount and resize
    useEffect(() => {
        const checkViewport = () => {
            setViewportHeight(window.innerHeight)
            setOrientation(window.innerHeight < window.innerWidth ? "landscape" : "portrait")
        }

        // Initialize
        checkViewport()

        // Listen for resize and orientation change
        window.addEventListener('resize', checkViewport)
        window.addEventListener('orientationchange', checkViewport)

        return () => {
            window.removeEventListener('resize', checkViewport)
            window.removeEventListener('orientationchange', checkViewport)
        }
    }, [])

    // Determine card dimensions based on screen size
    const getCardDimensions = useCallback(() => {
        switch (screenSize) {
            case "xs":
                return { width: 260, height: 320, padding: 12 }
            case "sm":
                return { width: 280, height: 340, padding: 16 }
            case "md":
                return { width: 300, height: 360, padding: 16 }
            case "lg":
                return { width: 320, height: 380, padding: 20 }
            case "xl":
                return { width: 340, height: 400, padding: 24 }
            default:
                return { width: 300, height: 360, padding: 16 }
        }
    }, [screenSize])

    // Dynamic container height based on card dimensions and viewport
    const getContainerHeight = useCallback(() => {
        const cardDimensions = getCardDimensions()
        // In portrait mode on small screens, use a smaller height
        if (orientation === "portrait" && (screenSize === "xs" || screenSize === "sm")) {
            return Math.min(cardDimensions.height, viewportHeight * 0.6)
        }
        return cardDimensions.height
    }, [getCardDimensions, orientation, screenSize, viewportHeight])

    // Responsive positions based on device and orientation
    const getPositions = useCallback(() => {
        const { width: cardWidth } = getCardDimensions()
        const horizontalSpacing = cardWidth * (screenSize === "xs" ? 0.5 : screenSize === "sm" ? 0.6 : 0.7)

        // For very small screens or portrait orientation, stack cards more vertically
        if (screenSize === "xs" || (orientation === "portrait" && screenSize !== "xl")) {
            return {
                front: { x: 0, z: 50, scale: 1, opacity: 1, zIndex: 40, rotateY: 0 },
                right: { x: horizontalSpacing * 0.8, z: -30, scale: 0.75, opacity: 0.6, zIndex: 30, rotateY: -15 },
                back: { x: 0, z: -80, scale: 0.5, opacity: 0.3, zIndex: 20, rotateY: 0 },
                left: { x: -horizontalSpacing * 0.8, z: -30, scale: 0.75, opacity: 0.6, zIndex: 30, rotateY: 15 },
            }
        }

        // Standard responsive positioning for other screen sizes
        return {
            front: { x: 0, z: 80, scale: 1, opacity: 1, zIndex: 40, rotateY: 0 },
            right: { x: horizontalSpacing, z: -40, scale: 0.85, opacity: 0.7, zIndex: 30, rotateY: -20 },
            back: { x: 0, z: -150, scale: 0.7, opacity: 0.4, zIndex: 20, rotateY: 0 },
            left: { x: -horizontalSpacing, z: -40, scale: 0.85, opacity: 0.7, zIndex: 30, rotateY: 20 },
        }
    }, [getCardDimensions, orientation, screenSize])

    // Get current positions
    const positions = getPositions()

    // Enhanced easing function for smoother animations
    const customEase = "power3.inOut"

    const positionCards = useCallback(() => {
        if (!cardsRef.current.length) return

        cardsRef.current.forEach((card, index) => {
            let position

            // Assign position based on index
            switch (index) {
                case 0:
                    position = positions.front
                    break
                case 1:
                    position = positions.right
                    break
                case 2:
                    position = positions.back
                    break
                case 3:
                    position = positions.left
                    break
                default:
                    // For more than 4 testimonials
                    position = {
                        ...positions.back,
                        z: positions.back.z - 50 * (index - 2),
                        opacity: Math.max(0.1, positions.back.opacity - 0.2 * (index - 2)),
                    }
            }

            gsap.to(card, {
                x: position.x,
                z: position.z,
                scale: position.scale,
                opacity: position.opacity,
                zIndex: position.zIndex,
                rotationY: position.rotateY,
                duration: isRotating ? 1.2 : 0,
                ease: customEase,
            })
        })
    }, [isRotating, positions])

    // Auto-rotate functionality with adaptive timing based on screen size
    useEffect(() => {
        // Longer interval on mobile for better reading experience
        const interval = screenSize === "xs" || screenSize === "sm" ? 10000 : 8000

        const autoRotate = setInterval(() => {
            if (!autoRotatePaused && !isRotating) {
                rotateCards()
            }
        }, interval)

        return () => clearInterval(autoRotate)
    }, [autoRotatePaused, isRotating, screenSize])

    // Initialize carousel
    useEffect(() => {
        if (carouselRef.current) {
            gsap.set(carouselRef.current, { perspective: 1200 })
            cardsRef.current = Array.from(document.querySelectorAll(".testimonial-card"))
            positionCards()
        }
    }, [positionCards])

    // Handle card positions update
    useEffect(() => positionCards(), [positionedTestimonials, positionCards])

    // Reposition cards when screen size or orientation changes
    useEffect(() => {
        positionCards()
    }, [screenSize, orientation, positionCards])

    const rotateCards = (direction = "next") => {
        if (isRotating) return
        setIsRotating(true)

        // Animate the active button
        if (buttonRef.current) {
            // Clear any existing animations
            gsap.killTweensOf(buttonRef.current)

            // Scale animation for the active button
            gsap.to(buttonRef.current, {
                scale: 1.2,
                duration: 0.3,
                ease: "back.out",
                yoyo: true,
                repeat: 1,
            })
        }

        // Create animation timeline
        timelineRef.current = gsap.timeline({
            onComplete: () => {
                // Update positioned testimonials to reflect the rotation
                setPositionedTestimonials((prevTestimonials) => {
                    if (direction === "next") {
                        // Move the last item to the front for clockwise rotation
                        const newOrder = [...prevTestimonials]
                        const lastItem = newOrder.pop()
                        if (lastItem) newOrder.unshift(lastItem)
                        return newOrder
                    } else {
                        // Move the first item to the end for counter-clockwise rotation
                        const newOrder = [...prevTestimonials]
                        const firstItem = newOrder.shift()
                        if (firstItem) newOrder.push(firstItem)
                        return newOrder
                    }
                })

                setIsRotating(false)
            },
        })

        // Enhanced rotation effect
        cardsRef.current.forEach((card, index) => {
            // Calculate next position in rotation sequence
            // Clockwise: front(0) -> right(1) -> back(2) -> left(3) -> front(0)
            let nextPositionIndex
            if (direction === "next") {
                nextPositionIndex = (index - 1 + 4) % 4 // Move one position counterclockwise in array (which is clockwise visually)
            } else {
                nextPositionIndex = (index + 1) % 4 // Move one position clockwise in array (which is counterclockwise visually)
            }

            // Get rotation values based on screen size
            const rotationFactor = screenSize === "xs" ? 0.7 : screenSize === "sm" ? 0.8 : 1

            let fromRotationY, toRotationY

            // Determine rotation angles based on position transition and screen size
            if (direction === "next") {
                // Front to right
                if (index === 0) {
                    fromRotationY = 0
                    toRotationY = -25 * rotationFactor
                }
                // Right to back
                else if (index === 1) {
                    fromRotationY = -25 * rotationFactor
                    toRotationY = 0
                }
                // Back to left
                else if (index === 2) {
                    fromRotationY = 0
                    toRotationY = 25 * rotationFactor
                }
                // Left to front
                else if (index === 3) {
                    fromRotationY = 25 * rotationFactor
                    toRotationY = 0
                } else {
                    fromRotationY = 0
                    toRotationY = 0
                }
            } else {
                // Counter-clockwise movement
                if (index === 0) {
                    fromRotationY = 0
                    toRotationY = 25 * rotationFactor
                } else if (index === 3) {
                    fromRotationY = 25 * rotationFactor
                    toRotationY = 0
                } else if (index === 2) {
                    fromRotationY = 0
                    toRotationY = -25 * rotationFactor
                } else if (index === 1) {
                    fromRotationY = -25 * rotationFactor
                    toRotationY = 0
                } else {
                    fromRotationY = 0
                    toRotationY = 0
                }
            }

            // Get target position
            let targetPosition
            switch (nextPositionIndex) {
                case 0:
                    targetPosition = positions.front
                    break
                case 1:
                    targetPosition = positions.right
                    break
                case 2:
                    targetPosition = positions.back
                    break
                case 3:
                    targetPosition = positions.left
                    break
                default:
                    targetPosition = positions.back
            }

            // Adjust animation timing based on screen size
            const animDuration = screenSize === "xs" || screenSize === "sm" ? 0.5 : 0.6
            const animDelay = screenSize === "xs" || screenSize === "sm" ? 0.4 : 0.5

            // Adjust vertical movement based on screen size
            const verticalMove = screenSize === "xs" ? -15 : screenSize === "sm" ? -20 : -30

            // First move up/down with initial rotation
            timelineRef.current?.to(
                card,
                {
                    y: index === 0 ? verticalMove : 0, // Front card moves up
                    rotationY: fromRotationY,
                    duration: animDuration,
                    ease: "power2.out",
                },
                0,
            )

            // Then move to new position with appropriate rotation
            timelineRef.current?.to(
                card,
                {
                    x: targetPosition.x,
                    z: targetPosition.z,
                    y: nextPositionIndex === 0 ? 0 : 0, // New front card gently lands
                    scale: targetPosition.scale,
                    opacity: targetPosition.opacity,
                    rotationY: toRotationY,
                    duration: animDuration,
                    ease: "power2.inOut",
                },
                animDelay,
            )
        })
    }

    // Enhanced touch/swipe handling - works better on all devices
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e) => {
        const deltaX = e.changedTouches[0].clientX - touchStartX.current
        const deltaY = e.changedTouches[0].clientY - touchStartY.current

        // Only process horizontal swipes (prevent conflicts with vertical scrolling)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            deltaX > 0 ? rotateCards("prev") : rotateCards("next")
        }
    }

    // Avatar floating animation
    useEffect(() => {
        const frontAvatar = cardsRef.current[0]?.querySelector(".avatar-container")
        if (frontAvatar) {
            // Adjust animation based on screen size
            const floatDistance = screenSize === "xs" ? -8 : screenSize === "sm" ? -10 : -15

            const float = gsap.to(frontAvatar, {
                y: floatDistance,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            })
            return () => float.kill()
        }
    }, [positionedTestimonials, screenSize])

    // Get dimensions for all elements
    const cardDimensions = getCardDimensions()
    const containerHeight = getContainerHeight()

    // Calculate optimal font sizes based on card dimensions
    const getTitleSize = () => {
        switch (screenSize) {
            case "xs": return "text-sm"
            case "sm": return "text-base"
            default: return "text-lg"
        }
    }

    const getSubtitleSize = () => {
        switch (screenSize) {
            case "xs": return "text-xs"
            default: return "text-sm"
        }
    }

    const getContentSize = () => {
        switch (screenSize) {
            case "xs": return "text-xs leading-relaxed"
            case "sm": return "text-sm leading-relaxed"
            default: return "text-base leading-relaxed"
        }
    }

    // Calculate maximum content length based on screen size
    const getMaxContentLength = () => {
        switch (screenSize) {
            case "xs": return 100
            case "sm": return 140
            case "md": return 200
            default: return 1000 // No truncation
        }
    }

    // Truncate content text if needed
    const truncateContent = (content) => {
        const maxLength = getMaxContentLength()
        if (content.length <= maxLength) return content
        return `${content.substring(0, maxLength)}...`
    }

    return (
        <div
            className="relative w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6"
            style={{ height: `${containerHeight + 80}px` }} // Extra space for controls
        >
            <div
                ref={carouselRef}
                className="relative w-full flex justify-center items-center"
                style={{ height: `${containerHeight}px` }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setAutoRotatePaused(true)}
                onMouseLeave={() => setAutoRotatePaused(false)}
            >
                {positionedTestimonials.map((testimonial, index) => (
                    <div
                        key={testimonial.id || `testimonial-${index}`}
                        className="testimonial-card absolute bg-white rounded-xl shadow-xl flex flex-col justify-between cursor-pointer
                        transition-[filter] duration-300 hover:brightness-100"
                        style={{
                            width: `${cardDimensions.width}px`,
                            height: `${cardDimensions.height}px`,
                            padding: `${cardDimensions.padding}px`,
                            transformStyle: "preserve-3d",
                            backfaceVisibility: "hidden",
                            filter: index === 0 ? "none" : "brightness(0.97)",
                        }}
                    >
                        <div className="flex justify-center mb-2 sm:mb-3 md:mb-4">
                            <div className="avatar-container relative rounded-full overflow-hidden border-4 border-gray-100 shadow-md"
                                style={{
                                    width: screenSize === "xs" ? "3.5rem" : screenSize === "sm" ? "4rem" : "5rem",
                                    height: screenSize === "xs" ? "3.5rem" : screenSize === "sm" ? "4rem" : "5rem"
                                }}
                            >
                                <Image
                                    src={testimonial.avatar || "/placeholder.svg"}
                                    alt={testimonial.name}
                                    fill
                                    sizes={`(max-width: 480px) 3.5rem, (max-width: 640px) 4rem, 5rem`}
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            </div>
                        </div>
                        <div className="flex-1 flex items-center overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                            <p className={`italic text-gray-700 text-center ${getContentSize()} transform transition-transform duration-300 group-hover:translate-y-1`}>
                                &quot;{truncateContent(testimonial.content)}&quot;
                            </p>
                        </div>
                        <div className="text-center mt-2 sm:mt-3 md:mt-4">
                            <h3 className={`font-semibold ${getTitleSize()} text-gray-800`}>{testimonial.name}</h3>
                            <p className={`${getSubtitleSize()} text-gray-500`}>{testimonial.role}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 flex gap-4 sm:gap-6 md:gap-8 lg:gap-10"
                style={{
                    bottom: screenSize === "xs" ? "-15px" : screenSize === "sm" ? "-20px" : "-25px",
                }}>
                <button
                    className={`rounded-full bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center shadow-xl
                    transition-all duration-300 hover:scale-110 hover:shadow-2xl ${isRotating ? "opacity-80 cursor-not-allowed" : ""}`}
                    style={{
                        width: screenSize === "xs" ? "2.5rem" : screenSize === "sm" ? "3rem" : "3.5rem",
                        height: screenSize === "xs" ? "2.5rem" : screenSize === "sm" ? "3rem" : "3.5rem",
                    }}
                    onClick={() => rotateCards("prev")}
                    disabled={isRotating}
                    aria-label="Previous testimonial"
                >
                    <ArrowLeft className={screenSize === "xs" ? "w-4 h-4" : "w-5 h-5"} />
                </button>
                <button
                    ref={buttonRef}
                    className={`rounded-full bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center shadow-xl
                    transition-all duration-300 hover:scale-110 hover:shadow-2xl ${isRotating ? "opacity-80 cursor-not-allowed" : ""}`}
                    style={{
                        width: screenSize === "xs" ? "2.5rem" : screenSize === "sm" ? "3rem" : "3.5rem",
                        height: screenSize === "xs" ? "2.5rem" : screenSize === "sm" ? "3rem" : "3.5rem",
                    }}
                    onClick={() => rotateCards("next")}
                    disabled={isRotating}
                    aria-label="Next testimonial"
                >
                    <ArrowRight className={screenSize === "xs" ? "w-4 h-4" : "w-5 h-5"} />
                </button>
            </div>
        </div>
    )
}

export default AnimatedTestimonials