"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { gsap } from "gsap"
import { motion, AnimatePresence } from "framer-motion"
import { services } from "./ServicesUtility"

const FixedFloatingBubbles = () => {
  // State for the active service
  const [activeService, setActiveService] = useState(1)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef(null)
  const bubblesRef = useRef(null)
  const bubbleRefs = useRef([])
  const contentRef = useRef(null)

  // Determine device type for responsive adjustments
  const getDeviceType = useCallback(() => {
    const { width } = windowSize
    if (width < 640) return "mobile"
    if (width < 1024) return "tablet"
    return "desktop"
  }, [windowSize])

  // Get responsive values based on device type
  const getResponsiveValues = useCallback(() => {
    const deviceType = getDeviceType()
    const { width, height } = windowSize

    // Base values that change with device type
    switch (deviceType) {
      case "mobile":
        return {
          baseSize: Math.min(width * 0.12, 50), // Smaller base size for mobile
          activeSize: Math.min(width * 0.18, 70), // Smaller active size for mobile
          orbitRadius: Math.min(width * 0.25, 110), // Smaller orbit for mobile
          fontSize: "0.75rem",
          activeFontSize: "0.85rem",
          contentWidth: "90%",
          contentPadding: "1rem",
          contentMarginTop: "2rem", // More space between bubbles and content
          showLabel: false, // Hide labels on mobile to save space
          contentPosition: "bottom", // Content below bubbles on mobile
          bubbleAreaHeight: 260, // Smaller height for bubble area on mobile
          iconSize: "w-4 h-4",
          activeIconSize: "w-5 h-5",
        }
      case "tablet":
        return {
          baseSize: 60,
          activeSize: 80,
          orbitRadius: Math.min(width * 0.22, 160), // Better fit for tablet screens
          fontSize: "0.9rem",
          activeFontSize: "1rem",
          contentWidth: "85%",
          contentPadding: "1.5rem",
          contentMarginTop: "2rem",
          showLabel: true,
          contentPosition: "bottom", // Content below bubbles on tablet
          bubbleAreaHeight: 300, // More compact for tablet
          iconSize: "w-5 h-5",
          activeIconSize: "w-6 h-6",
        }
      default: // desktop
        return {
          baseSize: 70,
          activeSize: 100,
          orbitRadius: Math.min(width * 0.15, 200), // More controlled orbit radius
          fontSize: "1rem",
          activeFontSize: "1.2rem",
          contentWidth: "40%",
          contentPadding: "2rem",
          contentMarginTop: "0",
          showLabel: true,
          contentPosition: width > 1280 ? "right" : "bottom", // Switch to vertical layout on smaller desktops
          bubbleAreaHeight: width > 1280 ? 450 : 350, // More compact heights overall
          iconSize: "w-6 h-6",
          activeIconSize: "w-7 h-7",
        }
    }
  }, [getDeviceType, windowSize])
  // Update bubble positions when active service changes
  const updateBubblePositions = useCallback(
    (newActiveId) => {
      if (!containerRef.current || !bubblesRef.current || bubbleRefs.current.length === 0) return

      const bubbleContainerRect = bubblesRef.current.getBoundingClientRect()
      const { baseSize, activeSize, orbitRadius, contentPosition } = getResponsiveValues()

      // Content takes right side on desktop, so adjust orbit accordingly
      const isDesktopLayout = contentPosition === "right"

      // Define the center point based on the bubble container dimensions
      const centerX = bubbleContainerRect.width / 2
      const centerY = bubbleContainerRect.height / 2

      // Set up GSAP timeline
      const tl = gsap.timeline()

      // Update position of each bubble
      bubbleRefs.current.forEach((bubble, index) => {
        if (!bubble) return

        const service = services[index]
        const isActive = service.id === newActiveId

        // Calculate position angle
        let angle

        if (isActive) {
          angle = 0 // Center
        } else {
          // Distribute other bubbles evenly
          const remainingServices = services.filter((s) => s.id !== newActiveId)
          const position = remainingServices.findIndex((s) => s.id === service.id)
          const totalPositions = remainingServices.length

          if (isDesktopLayout) {
            // On desktop, arrange in semi-circle on left side
            const arcStart = (5 * Math.PI) / 6 // ~150 degrees
            const arcLength = (7 * Math.PI) / 6 // ~210 degrees
            angle = arcStart + (position * arcLength) / totalPositions
          } else {
            // On mobile/tablet, arrange in full circle
            angle = position * ((2 * Math.PI) / totalPositions)
          }
        }

        // Calculate position
        const x = isActive ? centerX : centerX + orbitRadius * Math.cos(angle)
        const y = isActive ? centerY : centerY + orbitRadius * Math.sin(angle)

        // Calculate bubble size based on state
        const size = isActive ? activeSize : baseSize

        // Animate to new position and size
        tl.to(
          bubble,
          {
            left: x - size / 2, // Use absolute positioning properties
            top: y - size / 2,
            width: size,
            height: size,
            zIndex: isActive ? 10 : 5,
            duration: 0.8,
            ease: "power3.out",
          },
          0,
        )
      })
    },
    [getResponsiveValues, services],
  )

  // Setup the initial bubble positions with proper distribution
  const setupBubbles = useCallback(() => {
    if (!containerRef.current || !bubblesRef.current || bubbleRefs.current.length === 0) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const bubbleContainerRect = bubblesRef.current.getBoundingClientRect()
    const { baseSize, activeSize, orbitRadius, contentPosition } = getResponsiveValues()

    // Content takes right side on desktop, so adjust orbit accordingly
    const isDesktopLayout = contentPosition === "right"

    // Define the center point based on the bubble container, not the entire page
    const centerX = bubbleContainerRect.width / 2
    const centerY = bubbleContainerRect.height / 2

    // Set up GSAP timeline
    const tl = gsap.timeline()

    // Clear any existing animations
    gsap.killTweensOf(bubbleRefs.current)

    // Position each bubble in its initial place
    bubbleRefs.current.forEach((bubble, index) => {
      if (!bubble) return

      const service = services[index]
      const isActive = service.id === activeService

      // Calculate position angle (distribute evenly in a circle)
      let angle

      if (isActive) {
        angle = 0 // Center
      } else {
        // Distribute other bubbles evenly
        const remainingServices = services.filter((s) => s.id !== activeService)
        const position = remainingServices.findIndex((s) => s.id === service.id)
        const totalPositions = remainingServices.length

        if (isDesktopLayout) {
          // On desktop, arrange in semi-circle on left side
          // Start at 150 degrees and go 210 degrees counterclockwise
          const arcStart = (5 * Math.PI) / 6 // ~150 degrees
          const arcLength = (7 * Math.PI) / 6 // ~210 degrees
          angle = arcStart + (position * arcLength) / totalPositions
        } else {
          // On mobile/tablet, arrange in full circle
          angle = position * ((2 * Math.PI) / totalPositions)
        }
      }

      // Calculate position
      const x = isActive ? centerX : centerX + orbitRadius * Math.cos(angle)
      const y = isActive ? centerY : centerY + orbitRadius * Math.sin(angle)

      // Calculate bubble size based on state
      const size = isActive ? activeSize : baseSize

      // Set position and size with animation
      tl.to(
        bubble,
        {
          xPercent: 0,
          yPercent: 0,
          left: x - size / 2, // Position using left/top with absolute positioning
          top: y - size / 2,
          width: size,
          height: size,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: index * 0.1,
        },
        0,
      )
    })
  }, [activeService, getResponsiveValues, services])

  // Get screen size and set up resize listener
  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial size
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Initial load animation
    const loadTimer = setTimeout(() => {
      setIsLoaded(true)
      setupBubbles()
    }, 300)

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(loadTimer)
    }
  }, [])

  // Update bubble positions when screen size changes
  useEffect(() => {
    if (isLoaded) {
      // Add a small delay to ensure DOM is fully updated
      const resizeTimer = setTimeout(() => {
        setupBubbles()
      }, 100)

      return () => clearTimeout(resizeTimer)
    }
  }, [windowSize, isLoaded, setupBubbles])

  // Handle active service changes
  useEffect(() => {
    if (isLoaded) {
      updateBubblePositions(activeService)
      animateContentChange(activeService)
    }
  }, [activeService, isLoaded])

  // Animate content change
  const animateContentChange = useCallback((newActiveId) => {
    if (!contentRef.current) return

    gsap.to(contentRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => {
        gsap.to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.1,
        })
      },
    })
  }, [])

  // Handle bubble click
  const handleBubbleClick = (id) => {
    if (id !== activeService) {
      setActiveService(id)
    }
  }

  // Get active service data
  const activeServiceData = services.find((service) => service.id === activeService)

  // Get responsive layout values
  const {
    contentWidth,
    contentPadding,
    contentMarginTop,
    showLabel,
    contentPosition,
    bubbleAreaHeight,
    iconSize,
    activeIconSize
  } = getResponsiveValues()

  // Determine layout direction based on content position
  const isVerticalLayout = contentPosition === "bottom"

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-white text-black overflow-hidden"
      style={{ minHeight: isVerticalLayout ? `auto` : '100vh' }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 bg-white opacity-90"></div>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Section header */}
      <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-light tracking-wide z-10 p-4 sm:p-6 md:p-10">Services</h2>

      {/* Main content container with responsive layout */}
      <div
        className={`relative w-full flex ${isVerticalLayout ? "flex-col" : "flex-row"} items-center justify-center pb-12`}
      >
        {/* Bubbles container */}
        <div
          ref={bubblesRef}
          className={`relative ${isVerticalLayout ? "w-full" : "w-1/2"} flex items-center justify-center`}
          style={{
            height: bubbleAreaHeight,
            maxWidth: isVerticalLayout ? "100%" : "50%",
            position: "relative",
          }}
        >
          {/* Floating bubbles */}
          <AnimatePresence>
            {services.map((service, index) => {
              const isActive = service.id === activeService;

              return (
                <motion.div
                  key={service.id}
                  ref={(el) => (bubbleRefs.current[index] = el)}
                  className={`absolute rounded-full flex items-center justify-center cursor-pointer shadow-sm transition-colors`}
                  style={{
                    backgroundColor: isActive ? "black" : "rgba(0, 0, 0, 0.05)",
                    color: isActive ? "white" : "black",
                    border: `1px solid ${isActive ? "black" : "rgba(0, 0, 0, 0.2)"}`,
                    boxShadow: isActive ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none",
                    opacity: 0, // Start invisible for entrance animation
                    left: 0,
                    top: 0,
                    position: "absolute",
                    zIndex: isActive ? 50 : 40,
                    willChange: "transform, left, top, width, height", // Performance optimization
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={() => handleBubbleClick(service.id)}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: isActive
                      ? "0 8px 16px rgba(0, 0, 0, 0.2)"
                      : "0 4px 8px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }} // Feedback for touch interactions
                >
                  <div
                    className={`flex ${isActive ? "flex-col" : ""} items-center justify-center w-full h-full`}
                    style={{ padding: isActive ? '0.5rem' : '0' }}
                  >
                    {/* Icon container with simplified conditional rendering */}
                    <div className={isActive ? "mb-1" : ""}>
                      {React.cloneElement(service.svgIcon, {
                        className: `${isActive ? activeIconSize : iconSize} ${isActive ? "text-white" : "text-black opacity-80"}`,
                        "aria-hidden": "true"
                      })}
                    </div>

                    {/* Only show text label for active bubble */}
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.9 }}
                        exit={{ opacity: 0 }}
                        className="font-medium text-center"
                        style={{ fontSize: "0.7rem", lineHeight: 1.2, maxWidth: "90%" }}
                      >
                        {service.icon}
                      </motion.span>
                    )}
                  </div>

                  {/* Title label below active bubble (on larger screens) */}
                  {showLabel && isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: 0.1, duration: 0.2 }}
                      className="text-xs absolute font-medium tracking-wider bg-white/80 px-2 py-0.5 rounded-full text-black"
                      style={{
                        bottom: "-24px", // Position below the bubble
                        left: "50%",
                        transform: "translateX(-50%)",
                        whiteSpace: "nowrap",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                      }}
                    >
                      {service.title}
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Service content */}
        <div
          className={`relative ${isVerticalLayout ? "w-full px-4 sm:px-6" : "w-1/2 px-4 sm:px-6 md:pr-10"} z-0`}
          style={{
            maxWidth: isVerticalLayout ? contentWidth : "50%",
            marginTop: contentMarginTop,
          }}
        >
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white border border-black/20 p-4 sm:p-6 md:p-8 rounded-lg shadow-md"
          >
            <span className="inline-block px-2 py-1 border border-black/30 rounded-full text-xs mb-3 md:mb-4 tracking-wider">
              {activeServiceData?.icon} {activeServiceData?.title}
            </span>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-medium mb-4 md:mb-6">{activeServiceData?.title}</h3>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6 md:mb-8">{activeServiceData?.description}</p>

            {/* Service aspects */}
            <div className="mb-6 md:mb-8">
              <h4 className="text-xs sm:text-sm uppercase tracking-wider text-gray-600 mb-3 md:mb-4">Key Aspects</h4>
              <div className="flex flex-wrap gap-2">
                {activeServiceData?.aspects.map((aspect, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="px-2 sm:px-3 py-1 border border-black/20 rounded-full text-xs bg-gray-50"
                  >
                    {aspect}
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="px-4 sm:px-6 py-2 border border-black hover:bg-black hover:text-white transition-colors duration-300 text-xs sm:text-sm tracking-wider"
            >
              Explore Service
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile tip */}
      {getDeviceType() === "mobile" && (
        <div className="text-xs text-gray-600 text-center py-2 mb-2">
          Tap circles to explore services
        </div>
      )}
    </div>
  )
}

export default FixedFloatingBubbles