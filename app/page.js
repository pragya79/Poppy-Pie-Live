// "use client";

// import React, { useRef, useState, useEffect, Suspense } from "react";
// import { motion, useInView } from "framer-motion";
// import dynamic from "next/dynamic";
// import Head from "next/head";

// import HeroSection from "./components/Home/HeroSection";

// const ServicesSection = dynamic(() =>
//   import("./components/Home/Services/ServicesSection").then(mod => mod.default),
//   {
//     ssr: true,
//     loading: () => <LoadingPlaceholder height="600px" />
//   }
// );

// const BrandingModel = dynamic(() =>
//   import("./components/Home/Branding/BrandingModel").then(mod => mod.default),
//   {
//     ssr: true,
//     loading: () => <LoadingPlaceholder height="500px" />
//   }
// );

// const WorkAndBlogsSection = dynamic(() =>
//   import("./components/Home/Work and Blog/Worksection").then(mod => mod.default),
//   {
//     ssr: true,
//     loading: () => <LoadingPlaceholder height="650px" />
//   }
// );

// const Preloader = dynamic(() =>
//   import("./components/Preloader").then(mod => mod.default),
//   { ssr: false }
// );

// const LoadingPlaceholder = ({ height = "400px" }) => (
//   <div
//     className="w-full animate-pulse bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"
//     style={{ height, maxWidth: "100vw" }}
//     role="status"
//     aria-label="Loading content"
//   >
//     <span className="sr-only">Loading...</span>
//   </div>
// );

// const fadeIn = {
//   hidden: { opacity: 0, y: 30 },
//   visible: (i = 0) => ({
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.6,
//       delay: i * 0.2,
//       ease: [0.2, 0.65, 0.3, 0.9],
//     },
//   }),
// };

// const slideIn = {
//   hidden: { opacity: 0, x: -40 },
//   visible: {
//     opacity: 1,
//     x: 0,
//     transition: {
//       duration: 0.5,
//       ease: "easeOut",
//     },
//   },
// };

// const AnimatedSection = ({
//   children,
//   variants,
//   viewAmount = 0.1,
//   className = "",
//   id = "",
// }) => {
//   const ref = useRef(null);
//   const isInView = useInView(ref, {
//     once: true,
//     amount: viewAmount,
//     rootMargin: "50px 0px",
//   });

//   return (
//     <motion.section
//       id={id}
//       ref={ref}
//       initial="hidden"
//       animate={isInView ? "visible" : "hidden"}
//       variants={variants}
//       className={className}
//     >
//       {children}
//     </motion.section>
//   );
// };

// export default function Home() {
//   const [loading, setLoading] = useState(true);
//   const [isFirstLoad, setIsFirstLoad] = useState(true);

//   useEffect(() => {
//     const hasVisited = sessionStorage.getItem('visited-home');

//     if (hasVisited) {
//       setIsFirstLoad(false);
//       setLoading(false);
//     } else {
//       sessionStorage.setItem('visited-home', 'true');
//     }

//     const preloadImages = ['/logo.png'];
//     preloadImages.forEach(src => {
//       const img = new Image();
//       img.src = src;
//     });
//   }, []);

//   const handleComplete = () => {
//     setLoading(false);
//   };

//   useEffect(() => {
//     const preconnectDomains = [];

//     const links = preconnectDomains.map(domain => {
//       const link = document.createElement('link');
//       link.rel = 'preconnect';
//       link.href = domain;
//       return link;
//     });

//     links.forEach(link => document.head.appendChild(link));

//     return () => {
//       links.forEach(link => {
//         if (document.head.contains(link)) {
//           document.head.removeChild(link);
//         }
//       });
//     };
//   }, []);

//   return (
//     <>
//       <Head>
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <meta name="description" content="The Poppy Pie - Marketing, branding, and growth management services to help your business thrive." />
//         <link rel="preload" as="image" href="/logo.png" />
//       </Head>

//       {isFirstLoad && loading ? (
//         <Preloader onComplete={handleComplete} />
//       ) : (
//         <div className="overflow-hidden">
//           <HeroSection />

//           <AnimatedSection
//             variants={fadeIn}
//             className="my-8"
//             id="services-section"
//           >
//             <Suspense fallback={<LoadingPlaceholder height="600px" />}>
//               <ServicesSection />
//             </Suspense>
//           </AnimatedSection>

//           <AnimatedSection
//             variants={slideIn}
//             className="my-8"
//             id="branding-section"
//           >
//             <Suspense fallback={<LoadingPlaceholder height="500px" />}>
//               <BrandingModel />
//             </Suspense>
//           </AnimatedSection>

//           <AnimatedSection
//             variants={fadeIn}
//             className="my-8"
//             id="work-blogs-section"
//           >
//             <Suspense fallback={<LoadingPlaceholder height="650px" />}>
//               <WorkAndBlogsSection />
//             </Suspense>
//           </AnimatedSection>
//         </div>
//       )}
//     </>
//   );
// }


'use client'
import React, { useEffect, useState, useCallback } from "react";
import {
  FaAddressCard,
  FaCross,
  FaBolt,
  FaGem,
  FaArrowRight,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const TESTIMONIAL_IMAGES = [
  { id: 1, bgImage: '/testimonials/t1.png', alt: "Client testimonial from Company ABC about their successful digital marketing campaign", name: "John Doe, ABC Inc." },
  { id: 2, bgImage: '/testimonials/t2.png', alt: "Client testimonial from XYZ Ltd showcasing their brand transformation", name: "Jane Smith, XYZ Ltd." },
  { id: 3, bgImage: '/testimonials/t3.png', alt: "Testimonial from a startup describing their marketing journey", name: "Alex Johnson, Startup Co." },
  { id: 4, bgImage: '/testimonials/t4.png', alt: "Corporate client feedback on strategic brand positioning", name: "Sarah Williams, Corporate Inc." },
];

const COLLECTIONS = [
  {
    title: "Brands We Have Worked With",
    text: [
      "Worked with 10+ brands.",
      "Experienced in building and executing brand strategies.",
      "Collaborated with companies like Business Enablers, Profess, Eduacademy, and Uniqus.",
      "Contributed to a project in association with Harvard University.",
      "Strong understanding of branding implementation in real scenarios.",
    ],
    img: '/marketing-images/image1.jpg',
    alt: "A collage of various brand logos we've collaborated with including Business Enablers and Harvard University",
  },
  {
    title: "Content Collection",
    text: [
      "Created a video for IDA that reached 70K organic views.",
      "Produced a video for Kahba Design Studio that gained 1.5K organic views.",
      "Started my own podcast series, FROM SCRATCH — the first reel received 1.5K organic views.",
      "Built a community of 500+ marketing enthusiasts.",
      "Wrote a blog for Business Enablers, which was read by nearly 1,000 people.",
    ],
    img: '/marketing-images/image2.jpg',
    alt: "Visual display of content statistics showcasing video views and reader engagement metrics",
    dark: true,
  },
  {
    title: "Tech Collection",
    text: [
      "www.kahbadesignstudio.com",
      "www.bizzenablers.com",
      "www.nitinchalana.in",
      "www.uniqusedutech.com",
      "www.shopida.in",
      "Email Automation using Python",
      "Worked on 25+ such projects",
    ],
    img: '/marketing-images/image3.jpg',
    alt: "Screenshot collage of various websites and technological solutions developed for clients",
  },
  {
    title: "Brand Strategies",
    text: [
      "Worked on an installation in Sector-17 for Kahba Design Studio.",
      "Closed a deal with 100+ clients for Profcess using LinkedIn and email automation",
      "Successfully conducted 10+ events across the Tricity region",
      "Automated the data extraction process for Business Enablers.",
      "Launched Airbnb and built a community for Culinary Crescendo, resulting in ₹80K in sales within one month.",
      "Developed strategic campaigns for various other brands as well.",
    ],
    img: '/marketing-images/image4.jpg',
    alt: "Visual representation of brand strategy implementations and campaign results across multiple projects",
  },
];

const PORTFOLIO_ITEMS = [
  {
    title: "Best Website",
    description: "My own personal portfolio website",
    imageSrc: "/image.png",
    link: "https://www.nitinchalana.in",
  },
  {
    title: "Best Reel",
    description: "Created reel for IDA",
    imageSrc: "/reel.png",
    link: "https://www.instagram.com/reel/DFP1cyUPlzG/",
  },
  {
    title: "Best Podcast",
    description: "Our first podcast with Horseshoe Hospitality",
    imageSrc: "/thumbnail.png",
    link: "https://youtu.be/WWn2jGYcJDs?si=3k1nyH_UdbQ0O4zi",
  },
  {
    title: "Best Strategy",
    description: "Automated the process of lead generation for Profcess",
    imageSrc: "/leads.png",
    link: "#",
  },
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Reusable components
const StatItem = ({ icon: Icon, value, label }) => (
  <motion.div
    className="text-center"
    variants={itemFadeIn}
    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
  >
    <Icon size={28} className="mx-auto text-black" aria-hidden="true" />
    <h3 className="text-4xl font-medium mt-3 mb-1">{value}</h3>
    <p className="uppercase text-gray-500 text-xs tracking-wider">{label}</p>
  </motion.div>
);

const CollectionCard = ({ title, text, img, alt, dark }) => {
  return (
    <motion.div
      className={`relative group h-96 bg-cover bg-center overflow-hidden ${dark ? "text-white" : "text-black"}`}
      style={{ backgroundImage: `url(${img})` }}
      role="region"
      aria-labelledby={`collection-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
      initial={{ opacity: 0.8 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-70 transition-all duration-500 ease-in-out"
        aria-hidden="true"
      />

      {/* Title Card (Visible by default) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-500 group-hover:opacity-0"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="px-5 py-3 text-sm font-medium bg-black text-white rounded-2xl shadow-lg">
          <h3
            id={`collection-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-xl font-bold"
          >
            {title}
          </h3>
        </span>
      </motion.div>

      {/* Content (Visible on hover) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-95 transition-all duration-500 ease-in-out z-20"
        aria-hidden="true"
      >
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        {Array.isArray(text) ? (
          <ul className="text-sm text-white list-disc list-inside space-y-2 text-left max-w-md">
            {text.map((point, idx) => (
              <li key={idx} className="opacity-90">{point}</li>
            ))}
          </ul>
        ) : (
          <p className="text-white text-sm">{text}</p>
        )}
      </div>
    </motion.div>
  );
};

const PortfolioItem = ({ title, description, imageSrc, link }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -5, transition: { duration: 0.3 } }}
  >
    <Link
      href={link || "#"}
      target={link ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="group block text-left overflow-hidden rounded-lg border border-gray-100 transition-all duration-300 hover:shadow-xl"
      aria-labelledby={`portfolio-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
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
          id={`portfolio-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="font-semibold uppercase text-sm group-hover:text-black transition-colors"
        >
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
        {link && (
          <motion.div
            className="mt-3 flex items-center text-xs text-gray-400 group-hover:text-black transition-colors"
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
          >
            <span>View project</span>
            <FaArrowRight className="ml-1 text-xs" aria-hidden="true" />
          </motion.div>
        )}
      </div>
    </Link>
  </motion.div>
);

// Main component
const ServicePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonialsLength = TESTIMONIAL_IMAGES.length;

  // Auto-carousel with useCallback for performance
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonialsLength);
    }, 3500);
    return () => clearInterval(interval);
  }, [testimonialsLength]);

  // Click handler for testimonial navigation
  const handleTestimonialClick = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  // Handler for keyboard navigation
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

  // Pause auto-rotation when user is focusing on carousel
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonialsLength);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, testimonialsLength]);

  return (
    <motion.main
      className="bg-white text-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section with improved animation and spacing */}
      <section className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-16" aria-labelledby="hero-heading">
        <motion.div
          className="w-full lg:w-[45%] flex flex-col justify-center h-full py-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h3
            className="text-sm uppercase tracking-widest text-gray-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Your Growth, Our Mission
          </motion.h3>
          <motion.h1
            id="hero-heading"
            className="text-4xl sm:text-5xl font-semibold mt-4 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
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
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            We craft tailored marketing strategies that connect you with the right audience,
            boost your brand visibility, and drive real results.
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <motion.button
              className="px-8 py-3 bg-black text-white text-sm font-semibold tracking-wider hover:bg-gray-800 transition shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              aria-label="Get Started with our marketing services"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative w-full lg:w-[55%] h-[500px] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Testimonial Carousel with improved animations and accessibility */}
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
              {TESTIMONIAL_IMAGES.map((card, index) => {
                const position = (index - activeIndex + testimonialsLength) % testimonialsLength;
                let zIndex = 0;
                let transform = "";
                let opacity = "opacity-0";

                if (position === 0) {
                  zIndex = 30;
                  transform = "scale-110";
                  opacity = "opacity-100";
                } else if (position === 1) {
                  zIndex = 20;
                  transform = "-translate-x-[10rem] scale-100";
                  opacity = "opacity-90";
                } else if (position === testimonialsLength - 1) {
                  zIndex = 10;
                  transform = "translate-x-[10rem] scale-100";
                  opacity = "opacity-90";
                } else {
                  zIndex = 5;
                  transform = "scale-90";
                  opacity = "opacity-0";
                }

                const isActive = position === 0;

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
                    className={`absolute bg-cover bg-center w-72 h-96 rounded-2xl shadow-xl cursor-pointer ${opacity} ${transform} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900`}
                    style={{
                      zIndex,
                      backgroundImage: `url(${card.bgImage})`,
                    }}
                    initial={{
                      scale: 0.9,
                      opacity: 0
                    }}
                    animate={{
                      scale: position === 0 ? 1.1 : position === 1 || position === testimonialsLength - 1 ? 1 : 0.9,
                      opacity: position === 0 ? 1 : position === 1 || position === testimonialsLength - 1 ? 0.9 : 0,
                      x: position === 1 ? -160 : position === testimonialsLength - 1 ? 160 : 0
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
          </div>

          {/* Testimonial navigation dots */}
          <div
            className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-40"
            role="tablist"
            aria-label="Testimonial navigation"
          >
            {TESTIMONIAL_IMAGES.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleTestimonialClick(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleTestimonialClick(index);
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${activeIndex === index ? "bg-black" : "bg-gray-400"}`}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-selected={activeIndex === index ? "true" : "false"}
                role="tab"
                initial={{ width: activeIndex === index ? 16 : 8, opacity: 0 }}
                animate={{ width: activeIndex === index ? 16 : 8, opacity: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section with improved animations and hover effects */}
      <motion.section
        className="bg-white py-20 px-8"
        aria-labelledby="stats-heading"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <motion.div
            className="text-center md:text-left md:w-1/4"
            variants={fadeIn}
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
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <StatItem icon={FaAddressCard} value="10+" label="Brands" />
            <StatItem icon={FaCross} value="3+" label="Years" />
            <StatItem icon={FaBolt} value="100+" label="Clients" />
            <StatItem icon={FaGem} value="500+" label="Members" />
          </motion.div>
        </div>
      </motion.section>

      {/* Collections Section with improved grid and hover effects */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0" aria-labelledby="collections-heading">
        <h2 id="collections-heading" className="sr-only">Our Collections and Achievements</h2>
        {COLLECTIONS.map((item, index) => (
          <CollectionCard key={index} {...item} />
        ))}
      </section>

      {/* Portfolio Section with improved grid and hover effects */}
      <motion.section
        className="py-20 bg-white text-center"
        aria-labelledby="portfolio-heading"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            id="portfolio-heading"
            className="text-xl font-semibold uppercase tracking-widest mb-2"
            variants={fadeIn}
          >
            Our Best Work
          </motion.h2>
          <motion.p
            className="text-gray-500 text-sm mb-12 max-w-xl mx-auto"
            variants={fadeIn}
          >
            Best work done in past 2 months
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {PORTFOLIO_ITEMS.map((item, index) => (
              <PortfolioItem key={index} {...item} />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action with improved design */}
      <motion.section
        className="py-24 px-6 bg-gradient-to-b from-white to-gray-50 text-center"
        aria-labelledby="cta-heading"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-2xl md:text-3xl font-light text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Don&apos;t just go with the crowd,
          </motion.h2>
          <motion.h3
            id="cta-heading"
            className="text-3xl md:text-5xl font-bold mt-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Just Stand Out.
          </motion.h3>
          <motion.button
            className="mt-8 px-8 py-4 bg-black text-white text-sm font-semibold tracking-wider hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            aria-label="Contact Us for marketing services"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.button>
        </div>
      </motion.section>
    </motion.main>
  );
};

export default ServicePage;