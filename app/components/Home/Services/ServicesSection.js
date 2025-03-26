"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

const InvertedServicesAnimation = () => {
  // Create refs outside of render
  const svgRef = useRef(null)
  const lineRef = useRef(null)
  const circleRef = useRef(null)
  const dotRef = useRef(null)
  const circleArcRef = useRef(null);
  const rotatingLineRef = useRef(null);


  // State
  const [activeService, setActiveService] = useState(1)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

    // ============================================================
  // CONFIGURATION PARAMETERS - Adjust these values as needed
  // ============================================================

  // Circle and center position configuration
  const CONFIG = {
    // Center point of the circle (in SVG coordinates)
    circleCenterX: 80,
    circleCenterY: 10,
    circleRadius: 80,

    // Line configuration
    lineStartX: -100,
    lineStartY: 130,
    lineEndX: 80, // Should match circleCenterX
    lineEndY: 10, // Should match circleCenterY

    // Rotating line length
    rotatingLineLength: 80,

    // Service number positioning (distance from center as percentage of viewport)
    numberDistance: 30, // Base distance (%)

    // Fine-tuning offsets for each position (in pixels or percentage)
    positionOffsets: {
      right: { x: 0, y: 0 },
      bottom: { x: 0, y: 0 },
      left: { x: 0, y: 0 },
      top: { x: 0, y: 0 }
    },

    // Additional adjustments for each individual service by ID
    serviceAdjustments: {
      1: { x: "30rem", y: "1.5rem" },     // Right position (service 1)
      2: { x: "26rem", y: "5.5rem" },     // Bottom position (service 2)
      3: { x: "21rem", y: "1.5rem" },    // Left position (service 3)
      4: { x: "26rem", y: "-2rem" }     // Top position (service 4)
    },

    // Service content panel position
    serviceContentLeft: "240",  // in percentage or pixels (e.g. "96%" or "400px")
    serviceContentWidth: "500", // in percentage or pixels

    // Visual appearance
    activeOpacity: 1,
    inactiveOpacity: 0.4,
    activeScale: 1.05,
    circleOpacity: 0.15
  };

  // Service data with positions matching line rotation
  const services = [
    {
      id: 1,
      title: "Brand Strategy",
      description: "Defining your brand's vision, values, and positioning in the market. We conduct in-depth market research, competitor analysis, and audience segmentation to build a strategic roadmap that differentiates your brand and ensures long-term success.",
      position: "right", // Line points right (0 degrees)
    },
    {
      id: 2,
      title: "Visual Identity",
      description: "Creating compelling visual elements that represent your brand essence. From logo design and color palettes to typography and brand guidelines, we craft a cohesive and memorable visual identity that resonates with your target audience and strengthens brand recognition.",
      position: "bottom", // Line points down (90 degrees)
    },
    {
      id: 3,
      title: "Digital Experience",
      description: "Crafting memorable interactions across all digital touchpoints. We design and develop intuitive websites, engaging mobile experiences, and interactive interfaces that prioritize user experience, accessibility, and seamless navigation to maximize engagement and conversions.",
      position: "left", // Line points left (180 degrees)
    },
    {
      id: 4,
      title: "Content Creation",
      description: "Developing strategic content that engages your target audience. We specialize in copywriting, video production, and social media storytelling to build a compelling narrative that captures attention, drives traffic, and fosters meaningful connections with your brand.",
      position: "top", // Line points up (270 degrees)
    },
  ];


  // Create service refs array once
  const serviceRefs = useRef(Array(services.length).fill().map(() => ({ current: null })))

  // Initialize animations on component mount
  useEffect(() => {
    if (!lineRef.current) return

    // Get references to SVG elements
    const line = lineRef.current
    const circle = circleRef.current
    const dot = dotRef.current
    const circleArc = circleArcRef.current
    const rotatingLine = rotatingLineRef.current

    // Reset elements to initial state
    gsap.set(line, {
      strokeDasharray: line.getTotalLength(),
      strokeDashoffset: line.getTotalLength(),
      opacity: 0,
    })
    gsap.set(circle, { scale: 0, opacity: 0 })
    gsap.set(dot, { scale: 0, opacity: 0 })
    gsap.set(circleArc, { opacity: 0 })
    gsap.set(rotatingLine, { opacity: 0, rotation: 0, svgOrigin: `${CONFIG.circleCenterX} ${CONFIG.circleCenterY}` })

    // Create animation timeline
    const tl = gsap.timeline({ delay: 0.5 })

    // Animate the line drawing
    tl.to(line, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power2.inOut",
    })
      // Animate the dot appearance
      .to(dot, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
      // Create rotation effect for drawing the circle
      .to(circleArc, {
        opacity: 1,
        duration: 0.2,
        ease: "power1.inOut",
      })
      .to(circleArc, {
        rotation: 360,
        svgOrigin: `${CONFIG.circleCenterX} ${CONFIG.circleCenterY}`,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          // Once the rotation completes, show the full circle
          gsap.to(circle, {
            opacity: CONFIG.circleOpacity,
            scale: 1,
            duration: 0.3,
            ease: "power2.inOut"
          });
          // Hide the arc
          gsap.to(circleArc, {
            opacity: 0,
            duration: 0.2
          });
          // Make rotating line visible
          gsap.to(rotatingLine, {
            opacity: 1,
            duration: 0.2
          });
        }
      });

    // Animate service numbers appearing one by one
    tl.add(() => {
      serviceRefs.current.forEach((ref, index) => {
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            {
              y: 50,
              opacity: 0,
            },
            {
              y: 0,
              opacity: index === 0 ? CONFIG.activeOpacity : CONFIG.inactiveOpacity,
              duration: 0.5,
              delay: index * 0.1,
              ease: "power2.out",
            },
          )
        }
      })
    })

    setIsFirstLoad(false)

    // Cleanup function
    return () => {
      tl.kill()
    }
  }, [])

  // Handle service selection
  const handleServiceClick = (id) => {
    if (id !== activeService) {
      setActiveService(id)

      // Animate elements on service change
      if (!dotRef.current || !circleRef.current || !lineRef.current || !rotatingLineRef.current) return

      // Calculate rotation angle based on service ID
      const rotationAngle = (id - 1) * 90; // 90 degrees for each service

      // Rotate the rotating line
      gsap.to(rotatingLineRef.current, {
        rotation: rotationAngle,
        duration: 0.8,
        ease: "power2.inOut"
      });

      // Pulse animation for the dot
      gsap.to(dotRef.current, {
        scale: 1.5,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          if (dotRef.current) {
            gsap.to(dotRef.current, {
              scale: 1,
              duration: 0.2,
              ease: "power2.in",
            })
          }
        },
      })

      // Subtle animation for the circle
      gsap.to(circleRef.current, {
        scale: 0.95,
        duration: 0.3,
        ease: "power1.out",
        onComplete: () => {
          if (circleRef.current) {
            gsap.to(circleRef.current, {
              scale: 1,
              duration: 0.5,
              ease: "elastic.out(1, 0.75)",
            })
          }
        },
      })

      // Animate the line (optional ripple effect)
      gsap.fromTo(
        lineRef.current,
        { strokeWidth: 1.5 },
        {
          strokeWidth: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
        },
      )

      // Update service number styles
      serviceRefs.current.forEach((ref, index) => {
        if (ref.current) {
          gsap.to(ref.current, {
            opacity: services[index].id === id ? CONFIG.activeOpacity : CONFIG.inactiveOpacity,
            scale: services[index].id === id ? CONFIG.activeScale : 1,
            duration: 0.3,
            ease: "power2.inOut",
          })
        }
      })
    }
  }

  // Calculate position for each service number based on the circle
  const getNumberPosition = (position, serviceId) => {
    // Use absolute positioning relative to the viewport
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    // Calculate center coordinates
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;

    // Calculate radius (based on viewport size)
    const radius = Math.min(viewportWidth, viewportHeight) * 0.25; // 25% of the smaller dimension

    let angle, x, y;

    // Calculate position based on service position
    switch (position) {
      case 'right':
        angle = 0; // 0 degrees
        break;
      case 'bottom':
        angle = 90; // 90 degrees
        break;
      case 'left':
        angle = 180; // 180 degrees
        break;
      case 'top':
        angle = 270; // 270 degrees
        break;
      default:
        angle = 0;
    }

    // Convert angle to radians
    const radians = (angle * Math.PI) / 180;

    // Calculate x and y coordinates
    x = centerX + radius * Math.cos(radians);
    y = centerY + radius * Math.sin(radians);

    // Apply service-specific adjustments
    const adjustment = CONFIG.serviceAdjustments[serviceId] || { x: 0, y: 0 };

    // Determine positioning style
    return {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      transform: 'translate(-50%, -50%)',
      // Add offset adjustments
      marginLeft: adjustment.x,
      marginTop: adjustment.y,
    };
  };

  return (
    <div className="relative w-full h-screen bg-white text-black overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-white opacity-90"></div>

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'url("data:image/png;base64,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")',
        }}
      ></div>

      {/* SVG container */}
      <div className="absolute top-0 left-44 w-full h-full flex items-center justify-center">
        <svg ref={svgRef} viewBox="-250 -150 500 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Grid pattern for depth */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
          </pattern>
          <rect x="-250" y="-150" width="500" height="300" fill="url(#grid)" />

          {/* The growing line - shorter and starts from bottom */}
          <path
            ref={lineRef}
            d={`M${CONFIG.lineStartX} ${CONFIG.lineStartY} L ${CONFIG.lineEndX} ${CONFIG.lineEndY}`}
            stroke="black"
            strokeWidth="1"
            fill="none"
          />

          {/* Arc path that will rotate to form the circle */}
          <path
            ref={circleArcRef}
            d={`M${CONFIG.circleCenterX + CONFIG.circleRadius} ${CONFIG.circleCenterY} A${CONFIG.circleRadius} ${CONFIG.circleRadius} 0 0 1 ${CONFIG.circleCenterX} ${CONFIG.circleCenterY + CONFIG.circleRadius}`}
            stroke="black"
            strokeWidth="1.5"
            fill="none"
            opacity="0"
          />

          {/* Line that rotates when services change */}
          <line
            ref={rotatingLineRef}
            x1={CONFIG.circleCenterX}
            y1={CONFIG.circleCenterY}
            x2={CONFIG.circleCenterX + CONFIG.rotatingLineLength}
            y2={CONFIG.circleCenterY}
            stroke="black"
            strokeWidth="1"
            opacity="0"
          />

          {/* The circle that appears */}
          <circle
            ref={circleRef}
            cx={CONFIG.circleCenterX}
            cy={CONFIG.circleCenterY}
            r={CONFIG.circleRadius}
            fill="black"
            opacity="0"
          />

          {/* The dot at the connection point */}
          <circle
            ref={dotRef}
            cx={CONFIG.circleCenterX}
            cy={CONFIG.circleCenterY}
            r="3"
            fill="black"
            opacity="0"
          />
        </svg>
      </div>

      {/* Service details */}
      <h2 className="relative text-2xl md:text-4xl ml-[15rem] mt-82 font-medium tracking-wide z-50">Service</h2>

      <div
        className="absolute top-1/2 transform -translate-y-1/2 z-10"
        style={{ left: `${CONFIG.serviceContentLeft}px`, width: `${CONFIG.serviceContentWidth}px` }}
      >

        <div className="relative min-h-[160px]">
          {services.map((service) => {
            const isActive = activeService === service.id

            return (
              <div
                key={service.id}
                className="transition-all duration-500 absolute top-0 left-0 w-full"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: `translateY(${isActive ? '0' : '20px'})`,
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <h3 className="text-2xl mb-3 font-medium tracking-wide">{service.title}</h3>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">{service.description}</p>

                <div className="flex items-center text-xs">
                  <button className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-black hover:text-white hover:border-black transition-colors text-xs tracking-wide">
                    Details
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Service numbers positioned around the circle */}
      {services.map((service) => {
        const isActive = activeService === service.id;
        const position = getNumberPosition(service.position, service.id);

        return (
          <div
            key={service.id}
            ref={serviceRefs.current[service.id - 1]}
            className="absolute z-20 text-5xl md:text-6xl font-light cursor-pointer transition-all duration-300 flex items-center justify-center"
            style={{
              ...position,
              opacity: isFirstLoad ? 0 : isActive ? CONFIG.activeOpacity : CONFIG.inactiveOpacity,
              scale: isActive ? CONFIG.activeScale : 1,
              color: "black",
            }}
            onClick={() => handleServiceClick(service.id)}
          >
            <div className="relative group">
              <span>{service.id.toString().padStart(2, "0")}</span>

              {/* Indicator dot that appears when active */}
              <span
                className={`absolute -right-4 top-1/2 w-2 h-2 bg-black rounded-full transition-all duration-300 transform -translate-y-1/2 ${isActive ? 'opacity-100' : 'opacity-0'}`}
              />

              {/* Service title hint on hover */}
              <span className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-normal bg-white px-2 py-1 rounded shadow-sm whitespace-nowrap"
                style={{
                  top: service.position === 'top' ? 'auto' : service.position === 'bottom' ? '100%' : '50%',
                  bottom: service.position === 'top' ? '100%' : 'auto',
                  left: service.position === 'right' ? '100%' : service.position === 'left' ? 'auto' : '50%',
                  right: service.position === 'left' ? '100%' : 'auto',
                  transform:
                    service.position === 'top' || service.position === 'bottom'
                      ? 'translateX(-50%)'
                      : service.position === 'left' || service.position === 'right'
                        ? 'translateY(-50%)'
                        : 'translate(-50%, -50%)',
                  marginTop: service.position === 'bottom' ? '0.5rem' : 0,
                  marginBottom: service.position === 'top' ? '0.5rem' : 0,
                  marginLeft: service.position === 'right' ? '0.5rem' : 0,
                  marginRight: service.position === 'left' ? '0.5rem' : 0,
                }}
              >
                {service.title}
              </span>
            </div>
          </div>
        )
      })}

      {/* Minimal footer line */}
      <div className="absolute bottom-0 left-1/2 w-px h-16 bg-gray-200"></div>
    </div>
  )
}

export default InvertedServicesAnimation;