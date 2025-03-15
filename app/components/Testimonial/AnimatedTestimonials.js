"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ArrowLeft, ArrowRight } from "lucide-react"

const AnimatedTestimonials = ({ testimonials }) => {
    const [isRotating, setIsRotating] = useState(false)
    const [autoRotatePaused, setAutoRotatePaused] = useState(false)
    const carouselRef = useRef(null)
    const cardsRef = useRef([])
    const buttonRef = useRef(null)
    const timelineRef = useRef(null)
    const touchStartX = useRef(0)

    // Instead of tracking indices, we'll track the actual testimonial objects in their positions
    const [positionedTestimonials, setPositionedTestimonials] = useState([...testimonials])

    // Define positions with rotation values
    const positions = {
        front: { x: 0, z: 100, scale: 1, opacity: 1, zIndex: 40, rotateY: 0 },
        right: { x: 300, z: -50, scale: 0.85, opacity: 0.7, zIndex: 30, rotateY: -25 },
        back: { x: 0, z: -200, scale: 0.7, opacity: 0.4, zIndex: 20, rotateY: 0 },
        left: { x: -300, z: -50, scale: 0.85, opacity: 0.7, zIndex: 30, rotateY: 25 },
    }

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
    }, [isRotating])

    // Auto-rotate functionality
    useEffect(() => {
        const autoRotate = setInterval(() => {
            if (!autoRotatePaused && !isRotating) {
                rotateCards()
            }
        }, 8000)

        return () => clearInterval(autoRotate)
    }, [autoRotatePaused, isRotating])

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

            let fromRotationY, toRotationY

            // Determine rotation angles based on position transition
            if (direction === "next") {
                // Front to right
                if (index === 0) {
                    fromRotationY = 0
                    toRotationY = -25
                }
                // Right to back
                else if (index === 1) {
                    fromRotationY = -25
                    toRotationY = 0
                }
                // Back to left
                else if (index === 2) {
                    fromRotationY = 0
                    toRotationY = 25
                }
                // Left to front
                else if (index === 3) {
                    fromRotationY = 25
                    toRotationY = 0
                } else {
                    fromRotationY = 0
                    toRotationY = 0
                }
            } else {
                // Counter-clockwise movement
                if (index === 0) {
                    fromRotationY = 0
                    toRotationY = 25
                } else if (index === 3) {
                    fromRotationY = 25
                    toRotationY = 0
                } else if (index === 2) {
                    fromRotationY = 0
                    toRotationY = -25
                } else if (index === 1) {
                    fromRotationY = -25
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

            // First move up/down with initial rotation
            timelineRef.current?.to(
                card,
                {
                    y: index === 0 ? -30 : 0, // Front card moves up
                    rotationY: fromRotationY,
                    duration: 0.6,
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
                    duration: 0.6,
                    ease: "power2.inOut",
                },
                0.5,
            )
        })
    }

    // Touch/swipe handling
    const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX)
    const handleTouchEnd = (e) => {
        const deltaX = e.changedTouches[0].clientX - touchStartX.current
        if (Math.abs(deltaX) > 50) {
            deltaX > 0 ? rotateCards("prev") : rotateCards("next")
        }
    }

    // Avatar floating animation
    useEffect(() => {
        const frontAvatar = cardsRef.current[0]?.querySelector("img")
        if (frontAvatar) {
            const float = gsap.to(frontAvatar, {
                y: -15,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            })
            return () => float.kill()
        }
    }, [positionedTestimonials])

    return (
        <div className="relative w-full max-w-6xl h-96">
            <div
                ref={carouselRef}
                className="relative w-full h-full flex justify-center items-center"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setAutoRotatePaused(true)}
                onMouseLeave={() => setAutoRotatePaused(false)}
            >
                {positionedTestimonials.map((testimonial, index) => (
                    <div
                        key={testimonial.id || `testimonial-${index}`}
                        className="testimonial-card absolute w-80 h-96 p-8 bg-white rounded-xl shadow-xl flex flex-col justify-between cursor-pointer
                      transition-[filter] duration-300 hover:brightness-100"
                        style={{
                            transformStyle: "preserve-3d",
                            backfaceVisibility: "hidden",
                            filter: index === 0 ? "none" : "brightness(0.97)",
                        }}
                    >
                        <div className="flex justify-center mb-4">
                            <img
                                src={testimonial.avatar || "/placeholder.svg"}
                                alt={testimonial.name}
                                className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 shadow-md"
                                crossOrigin="anonymous"
                            />
                        </div>
                        <div className="flex-1 flex items-center">
                            <p
                                className="italic text-gray-700 text-center leading-relaxed transform transition-transform duration-300
                          group-hover:translate-y-1"
                            >
                                &quot;{testimonial.content}&quot;
                            </p>
                        </div>
                        <div className="text-center mt-4">
                            <h3 className="font-semibold text-lg text-gray-800">{testimonial.name}</h3>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-12">
                <button
                    className={`w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center shadow-xl
                transition-all duration-300 hover:scale-110 hover:shadow-2xl ${isRotating ? "opacity-80 cursor-not-allowed" : ""}`}
                    onClick={() => rotateCards("prev")}
                    disabled={isRotating}
                    aria-label="Previous testimonial"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                    ref={buttonRef}
                    className={`w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center shadow-xl
                transition-all duration-300 hover:scale-110 hover:shadow-2xl ${isRotating ? "opacity-80 cursor-not-allowed" : ""}`}
                    onClick={() => rotateCards("next")}
                    disabled={isRotating}
                    aria-label="Next testimonial"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default AnimatedTestimonials

