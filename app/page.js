"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import Head from "next/head";

import HeroSection from "./components/Home/HeroSection";

const ServicesSection = dynamic(() =>
  import("./components/Home/Services/ServicesSection").then(mod => mod.default),
  {
    ssr: true,
    loading: () => <LoadingPlaceholder height="600px" />
  }
);

const BrandingModel = dynamic(() =>
  import("./components/Home/Branding/BrandingModel").then(mod => mod.default),
  {
    ssr: true,
    loading: () => <LoadingPlaceholder height="500px" />
  }
);

const WorkAndBlogsSection = dynamic(() =>
  import("./components/Home/Work and Blog/Worksection").then(mod => mod.default),
  {
    ssr: true,
    loading: () => <LoadingPlaceholder height="650px" />
  }
);

const Preloader = dynamic(() =>
  import("./components/Preloader").then(mod => mod.default),
  { ssr: false }
);

const LoadingPlaceholder = ({ height = "400px" }) => (
  <div
    className="w-full animate-pulse bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"
    style={{ height, maxWidth: "100vw" }}
    role="status"
    aria-label="Loading content"
  >
    <span className="sr-only">Loading...</span>
  </div>
);

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.2,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
};

const slideIn = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const AnimatedSection = ({
  children,
  variants,
  viewAmount = 0.1,
  className = "",
  id = "",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: viewAmount,
    rootMargin: "50px 0px",
  });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('visited-home');

    if (hasVisited) {
      setIsFirstLoad(false);
      setLoading(false);
    } else {
      sessionStorage.setItem('visited-home', 'true');
    }

    const preloadImages = ['/logo.png'];
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleComplete = () => {
    setLoading(false);
  };

  useEffect(() => {
    const preconnectDomains = [];

    const links = preconnectDomains.map(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      return link;
    });

    links.forEach(link => document.head.appendChild(link));

    return () => {
      links.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="The Poppy Pie - Marketing, branding, and growth management services to help your business thrive." />
        <link rel="preload" as="image" href="/logo.png" />
      </Head>

      {isFirstLoad && loading ? (
        <Preloader onComplete={handleComplete} />
      ) : (
        <div className="overflow-hidden">
          <HeroSection />

          <AnimatedSection
            variants={fadeIn}
            className="my-8"
            id="services-section"
          >
            <Suspense fallback={<LoadingPlaceholder height="600px" />}>
              <ServicesSection />
            </Suspense>
          </AnimatedSection>

          <AnimatedSection
            variants={slideIn}
            className="my-8"
            id="branding-section"
          >
            <Suspense fallback={<LoadingPlaceholder height="500px" />}>
              <BrandingModel />
            </Suspense>
          </AnimatedSection>

          <AnimatedSection
            variants={fadeIn}
            className="my-8"
            id="work-blogs-section"
          >
            <Suspense fallback={<LoadingPlaceholder height="650px" />}>
              <WorkAndBlogsSection />
            </Suspense>
          </AnimatedSection>
        </div>
      )}
    </>
  );
}