"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import HeroSection from "./components/Home/HeroSection";
import ServicesSection from "./components/Home/Services/ServicesSection";
import BrandingModel from "./components/Home/Branding/BrandingModel";
import WorkAndBlogsSection from "./components/Home/Work and Blog/Worksection";

// Animation variants for different effects
const fadeIn = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.3,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
};

const slideIn = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

// Custom component for sections with animations
const AnimatedSection = ({ children, variants, viewAmount = 0.2, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: viewAmount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero section - can have a special animation if desired */}
      <HeroSection />

      {/* Services section with a fade-in animation */}
      <AnimatedSection
        variants={fadeIn}
        className="my-8"
      >
        <ServicesSection />
      </AnimatedSection>

      {/* Branding model with slide-in animation */}
      <AnimatedSection
        variants={slideIn}
        className="my-8"
      >
        <BrandingModel />
      </AnimatedSection>

      <AnimatedSection
        variants={slideIn}
        className="my-8"
      >
        <WorkAndBlogsSection />
      </AnimatedSection>
    </div>
  );
}