'use client'
import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  StatItem,
  CollectionCard,
  PortfolioItem,
  TestimonialCarousel
} from "./components/Home/UIComponents";
import {
  TESTIMONIAL_IMAGES,
  COLLECTIONS,
  PORTFOLIO_ITEMS,
  animations
} from "./components/Home/data"

/**
 * Main HomePage component that renders all sections
 * Orchestrates animations and state management for the page
 */
const HomePage = () => {
  // State for testimonial carousel
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonialsLength = TESTIMONIAL_IMAGES.length;
  const [isPaused, setIsPaused] = useState(false);

  // References for intersection observer
  const statsRef = useRef(null);
  const portfolioRef = useRef(null);
  const ctaRef = useRef(null);

  // InView states using Framer Motion's useInView hook
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const portfolioInView = useInView(portfolioRef, { once: true, amount: 0.3 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  // Auto-carousel with useEffect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonialsLength);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, testimonialsLength]);

  // Memoized event handlers
  const handleTestimonialClick = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const handleKeyDown = useCallback((e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleTestimonialClick(index);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonialsLength);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex - 1 + testimonialsLength) % testimonialsLength);
    }
  }, [handleTestimonialClick, testimonialsLength]);

  // Preload images for smoother experience
  useEffect(() => {
    // Preload testimonial images
    TESTIMONIAL_IMAGES.forEach(card => {
      const imgEl = document.createElement('img');
      imgEl.src = card.bgImage;
    });

    // Preload collection images
    COLLECTIONS.forEach(collection => {
      const imgEl = document.createElement('img');
      imgEl.src = collection.img;
    });
  }, []);

  return (
    <motion.main
      className="bg-white text-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-16" aria-labelledby="hero-heading">
        <motion.div
          className="w-full lg:w-[45%] flex flex-col justify-center h-full py-10"
          variants={animations.fadeInLeft}
          initial="hidden"
          animate="visible"
        >
          <motion.h3
            className="text-sm uppercase tracking-widest text-gray-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Your Growth, Our Mission
          </motion.h3>
          <motion.h1
            id="hero-heading"
            className="text-4xl sm:text-5xl font-semibold mt-4 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            This <em className="font-light italic text-gray-700">is where</em> your{" "}
            <strong className="bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-700">
              brand grows.
            </strong>
          </motion.h1>
          <motion.p
            className="text-gray-600 mt-6 max-w-lg text-base sm:text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            We craft tailored marketing strategies that connect you with the right audience,
            boost your brand visibility, and drive real results.
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.4 }}
          >
            <motion.button
              className="px-8 py-3 bg-black text-white text-sm font-semibold tracking-wider hover:bg-gray-800 transition shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              aria-label="Get Started with our marketing services"
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.975 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative w-full lg:w-[55%] h-[500px] flex items-center justify-center overflow-hidden"
          variants={animations.fadeInRight}
          initial="hidden"
          animate="visible"
        >
          <TestimonialCarousel
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            handleTestimonialClick={handleTestimonialClick}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            handleKeyDown={handleKeyDown}
            testimonialsLength={testimonialsLength}
            testimonialImages={TESTIMONIAL_IMAGES}
          />
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        ref={statsRef}
        className="bg-white py-20 px-8"
        aria-labelledby="stats-heading"
        variants={animations.fadeIn}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <motion.div
            className="text-center md:text-left md:w-1/4"
            variants={animations.fadeIn}
          >
            <h2 id="stats-heading" className="uppercase text-sm font-bold tracking-widest text-gray-800">
              Few Facts
            </h2>
            <p className="text-gray-500 mt-2 text-xl font-light">
              Statistics of <br className="hidden md:block" /> Our Success.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center md:justify-between md:flex-1 gap-12"
            variants={animations.staggerContainer}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            <StatItem icon="FaAddressCard" value="10+" label="Brands" />
            <StatItem icon="FaCross" value="3+" label="Years" />
            <StatItem icon="FaBolt" value="100+" label="Clients" />
            <StatItem icon="FaGem" value="500+" label="Members" />
          </motion.div>
        </div>
      </motion.section>

      {/* Collections Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0" aria-labelledby="collections-heading">
        <h2 id="collections-heading" className="sr-only">Our Collections and Achievements</h2>
        {COLLECTIONS.map((item, index) => (
          <CollectionCard key={index} {...item} />
        ))}
      </section>

      {/* Portfolio Section */}
      <motion.section
        ref={portfolioRef}
        className="py-20 bg-white text-center"
        aria-labelledby="portfolio-heading"
        variants={animations.fadeIn}
        initial="hidden"
        animate={portfolioInView ? "visible" : "hidden"}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            id="portfolio-heading"
            className="text-xl font-semibold uppercase tracking-widest mb-2"
            variants={animations.fadeIn}
          >
            Our Best Work
          </motion.h2>
          <motion.p
            className="text-gray-500 text-sm mb-12 max-w-xl mx-auto"
            variants={animations.fadeIn}
          >
            Best work done in past 2 months
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
            variants={animations.staggerContainer}
            initial="hidden"
            animate={portfolioInView ? "visible" : "hidden"}
          >
            {PORTFOLIO_ITEMS.map((item, index) => (
              <PortfolioItem key={index} {...item} />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        ref={ctaRef}
        className="py-24 px-6 bg-gradient-to-b from-white to-gray-50 text-center"
        aria-labelledby="cta-heading"
        variants={animations.fadeIn}
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-2xl md:text-3xl font-light text-gray-700"
            initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5 }}
          >
            Don&apos;t just go with the crowd,
          </motion.h2>
          <motion.h3
            id="cta-heading"
            className="text-3xl md:text-5xl font-bold mt-3 mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Just Stand Out.
          </motion.h3>
          <Link href={"/contact-us"} passHref>
            <motion.button
              className="mt-8 px-8 py-4 bg-black text-white text-sm font-semibold tracking-wider hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              aria-label="Contact Us for marketing services"
              initial={{ opacity: 0, y: 16 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.975 }}
            >
              Contact Us
            </motion.button>
          </Link>
        </div>
      </motion.section>
    </motion.main>
  );
};

export default HomePage;