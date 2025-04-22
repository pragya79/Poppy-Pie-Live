'use client'
import React, { useRef, useState } from "react";
import {
    FaAddressCard,
    FaCross,
    FaBolt,
    FaGem,
    FaArrowRight
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { animations } from "./data";

export const StatItem = ({ icon, value, label }) => {
    // Dynamically render the icon based on name
    const IconComponent = {
        FaAddressCard,
        FaCross,
        FaBolt,
        FaGem
    }[icon];

    return (
        <motion.div
            className="text-center"
            variants={animations.staggerItem}
            whileHover={{ scale: 1.025, transition: { duration: 0.25 } }}
        >
            <IconComponent size={28} className="mx-auto text-black" aria-hidden="true" />
            <h3 className="text-4xl font-medium mt-3 mb-1">{value}</h3>
            <p className="uppercase text-gray-500 text-xs tracking-wider">{label}</p>
        </motion.div>
    );
};

export const CollectionCard = ({ title, text, img, alt, dark }) => {
    const ref = useRef(null);
    const inView = useInView(ref, {
        triggerOnce: true,
        threshold: 0.3,
    });
    const [isActive, setIsActive] = useState(false);

    // Handle touch for mobile devices
    const handleTouch = () => {
        setIsActive(!isActive);
    };

    // Create a URL-friendly ID for accessibility
    const titleId = title.replace(/\s+/g, "-").toLowerCase();

    return (
        <motion.div
            ref={ref}
            className={`relative group h-64 sm:h-80 md:h-96 lg:h-[28rem] overflow-hidden ${dark ? "text-white" : "text-black"
                }`}
            role="region"
            aria-labelledby={`collection-title-${titleId}`}
            initial={{ opacity: 0.8 }}
            animate={inView ? { opacity: 1 } : { opacity: 0.8 }}
            transition={{ duration: 0.7 }}
            onClick={handleTouch}
            onTouchEnd={(e) => {
                e.preventDefault(); // Prevent double-firing on touch devices
                handleTouch();
            }}
        >
            {/* Background image with zoom effect on hover/tap */}
            <div
                className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out ${isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                style={{
                    backgroundImage: `url(${img})`,
                }}
                aria-hidden="true"
            />

            {/* Title Card (Visible by default, hidden on hover/tap) */}
            <div
                className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-500 ${isActive ? "opacity-0" : "group-hover:opacity-0"
                    }`}
            >
                <span className="px-3 sm:px-5 py-2 sm:py-3 text-sm sm:text-base font-medium bg-black/70 text-white rounded-lg shadow-lg backdrop-blur-sm">
                    <h3 id={`collection-title-${titleId}`} className="text-lg sm:text-xl md:text-2xl font-bold">
                        {title}
                    </h3>
                </span>
            </div>

            {/* Content (Visible on hover/tap) */}
            <div
                className={`absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 transform transition-all duration-500 ease-in-out z-20 ${isActive
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                    }`}
            >
                {/* Content container with improved visibility */}
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2 sm:p-3 md:p-4 w-full max-w-[90%] sm:max-w-[85%] md:max-w-md border border-white/20 shadow-xl">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 md:mb-3">
                        {title}
                    </h3>

                    {Array.isArray(text) ? (
                        <ul className="text-xs sm:text-sm md:text-base text-white list-disc list-outside ml-4 space-y-0.5 sm:space-y-1 md:space-y-1.5 text-left">
                            {text.map((point, idx) => (
                                <li key={idx} className="font-medium">
                                    {point}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-white text-xs sm:text-sm md:text-base font-medium">{text}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export const PortfolioItem = ({ title, description, imageSrc, link }) => {
    return (
        <motion.div
            variants={animations.staggerItem}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
        >
            <Link
                href={link || "#"}
                target={link ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="group block text-left overflow-hidden rounded-lg border border-gray-100 transition-all duration-300 hover:shadow-xl"
                aria-labelledby={`portfolio-title-${title.replace(/\s+/g, "-").toLowerCase()}`}
            >
                <div className="relative w-full aspect-square overflow-hidden">
                    <Image
                        src={imageSrc}
                        alt={`Portfolio showcase: ${title} - ${description}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                    />
                </div>
                <div className="p-4">
                    <h3
                        id={`portfolio-title-${title.replace(/\s+/g, "-").toLowerCase()}`}
                        className="font-semibold uppercase text-sm group-hover:text-black transition-colors"
                    >
                        {title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                    {link && (
                        <motion.div
                            className="mt-3 flex items-center text-xs text-gray-400 group-hover:text-black transition-colors"
                            initial={{ x: 0 }}
                            whileHover={{ x: 4 }}
                        >
                            <span>View project</span>
                            <FaArrowRight className="ml-1 text-xs" aria-hidden="true" />
                        </motion.div>
                    )}
                </div>
            </Link>
        </motion.div>
    );
};

export const TestimonialCarousel = ({
    activeIndex,
    setActiveIndex,
    handleTestimonialClick,
    isPaused,
    setIsPaused,
    handleKeyDown,
    testimonialsLength,
    testimonialImages
}) => {
    return (
        <div
            className="relative h-full w-full flex items-center justify-center"
            role="region"
            aria-roledescription="carousel"
            aria-label="Client Testimonials"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
        >
            <AnimatePresence>
                {testimonialImages.map((card, index) => {
                    const position = (index - activeIndex + testimonialsLength) % testimonialsLength;
                    let zIndex = 0;
                    const isActive = position === 0;

                    if (position === 0) {
                        zIndex = 30;
                    } else if (position === 1) {
                        zIndex = 20;
                    } else if (position === testimonialsLength - 1) {
                        zIndex = 10;
                    } else {
                        zIndex = 5;
                    }

                    return (
                        <motion.div
                            key={card.id}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`Testimonial ${index + 1} of ${testimonialsLength}: ${card.name}`}
                            aria-current={isActive ? "true" : "false"}
                            tabIndex={isActive ? 0 : -1}
                            onClick={() => handleTestimonialClick(index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="absolute bg-cover bg-center w-72 h-96 rounded-2xl shadow-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                            style={{
                                zIndex,
                                backgroundImage: `url(${card.bgImage})`,
                            }}
                            initial={{
                                scale: 0.9,
                                opacity: 0
                            }}
                            animate={{
                                scale: position === 0 ? 1.08 : position === 1 || position === testimonialsLength - 1 ? 1 : 0.92,
                                opacity: position === 0 ? 1 : position === 1 || position === testimonialsLength - 1 ? 0.9 : 0,
                                x: position === 1 ? -130 : position === testimonialsLength - 1 ? 130 : 0
                            }}
                            transition={{
                                duration: 0.7,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="sr-only">{card.alt}</div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* Testimonial navigation dots */}
            <div
                className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-40"
                role="tablist"
                aria-label="Testimonial navigation"
            >
                {testimonialImages.map((_, index) => (
                    <motion.button
                        key={index}
                        onClick={() => handleTestimonialClick(index)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleTestimonialClick(index);
                            }
                        }}
                        className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${activeIndex === index ? "bg-black" : "bg-gray-400"
                            }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                        aria-selected={activeIndex === index ? "true" : "false"}
                        role="tab"
                        initial={{ width: activeIndex === index ? 16 : 8, opacity: 0 }}
                        animate={{ width: activeIndex === index ? 16 : 8, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.15 }}
                    />
                ))}
            </div>
        </div>
    );
};