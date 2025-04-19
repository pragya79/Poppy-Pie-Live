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

// Reusable components
const StatItem = ({ icon: Icon, value, label }) => (
    <div className="text-center transition-transform duration-300 hover:scale-105">
        <Icon size={28} className="mx-auto text-black" aria-hidden="true" />
        <h3 className="text-4xl font-medium mt-3 mb-1">{value}</h3>
        <p className="uppercase text-gray-500 text-xs tracking-wider">{label}</p>
    </div>
);

const CollectionCard = ({ title, text, img, alt, dark }) => {
    return (
        <div
            className={`relative group h-96 bg-cover bg-center overflow-hidden ${dark ? "text-white" : "text-black"}`}
            style={{ backgroundImage: `url(${img})` }}
            role="region"
            aria-labelledby={`collection-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-70 transition-all duration-500 ease-in-out"
                aria-hidden="true"
            />

            {/* Title Card (Visible by default) */}
            <div className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-500 group-hover:opacity-0">
                <span className="px-5 py-3 text-sm font-medium bg-black text-white rounded-2xl shadow-lg">
                    <h3
                        id={`collection-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
                        className="text-xl font-bold"
                    >
                        {title}
                    </h3>
                </span>
            </div>

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
        </div>
    );
};

const PortfolioItem = ({ title, description, imageSrc, link }) => (
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
                <div className="mt-3 flex items-center text-xs text-gray-400 group-hover:text-black transition-colors">
                    <span>View project</span>
                    <FaArrowRight className="ml-1 text-xs transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
            )}
        </div>
    </Link>
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
        <main className="bg-white text-black">
            {/* Hero Section with improved animation and spacing */}
            <section className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-16" aria-labelledby="hero-heading">
                <div className="w-full lg:w-[45%] flex flex-col justify-center h-full py-10 animate-fade-in-up">
                    <h3 className="text-sm uppercase tracking-widest text-gray-600 font-medium">
                        Your Growth, Our Mission
                    </h3>
                    <h1 id="hero-heading" className="text-4xl sm:text-5xl font-semibold mt-4 leading-tight">
                        This <em className="font-light italic text-gray-700">is where</em> your{" "}
                        <strong className="bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-700">
                            brand grows.
                        </strong>
                    </h1>
                    <p className="text-gray-600 mt-6 max-w-lg text-base sm:text-lg leading-relaxed">
                        We craft tailored marketing strategies that connect you with the right audience,
                        boost your brand visibility, and drive real results.
                    </p>
                    <div className="mt-8">
                        <button
                            className="px-8 py-3 bg-black text-white text-sm font-semibold tracking-wider hover:bg-gray-800 transition shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                            aria-label="Get Started with our marketing services"
                        >
                            Get Started
                        </button>
                    </div>
                </div>

                <div className="relative w-full lg:w-[55%] h-[500px] flex items-center justify-center overflow-hidden">
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
                                <div
                                    key={card.id}
                                    role="group"
                                    aria-roledescription="slide"
                                    aria-label={`Testimonial ${index + 1} of ${testimonialsLength}: ${card.name}`}
                                    aria-current={isActive ? "true" : "false"}
                                    tabIndex={isActive ? 0 : -1}
                                    onClick={() => handleTestimonialClick(index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className={`absolute transition-all duration-700 ease-in-out bg-cover bg-center w-72 h-96 rounded-2xl shadow-xl cursor-pointer ${opacity} ${transform} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900`}
                                    style={{
                                        zIndex,
                                        backgroundImage: `url(${card.bgImage})`,
                                    }}
                                >
                                    <div className="sr-only">{card.alt}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Testimonial navigation dots */}
                    <div
                        className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-40"
                        role="tablist"
                        aria-label="Testimonial navigation"
                    >
                        {TESTIMONIAL_IMAGES.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleTestimonialClick(index)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleTestimonialClick(index);
                                    }
                                }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${activeIndex === index ? "bg-black w-4" : "bg-gray-400"}`}
                                aria-label={`Go to testimonial ${index + 1}`}
                                aria-selected={activeIndex === index ? "true" : "false"}
                                role="tab"
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section with improved animations and hover effects */}
            <section className="bg-white py-20 px-8" aria-labelledby="stats-heading">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="text-center md:text-left md:w-1/4">
                        <h2 id="stats-heading" className="uppercase text-sm font-bold tracking-widest text-gray-800">
                            Few Facts
                        </h2>
                        <p className="text-gray-500 mt-2 text-xl font-light">
                            Statistics of <br className="hidden md:block" /> Our Success.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-between md:flex-1 gap-12">
                        <StatItem icon={FaAddressCard} value="10+" label="Brands" />
                        <StatItem icon={FaCross} value="3+" label="Years" />
                        <StatItem icon={FaBolt} value="100+" label="Clients" />
                        <StatItem icon={FaGem} value="500+" label="Members" />
                    </div>
                </div>
            </section>

            {/* Collections Section with improved grid and hover effects */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-0" aria-labelledby="collections-heading">
                <h2 id="collections-heading" className="sr-only">Our Collections and Achievements</h2>
                {COLLECTIONS.map((item, index) => (
                    <CollectionCard key={index} {...item} />
                ))}
            </section>

            {/* Portfolio Section with improved grid and hover effects */}
            <section className="py-20 bg-white text-center" aria-labelledby="portfolio-heading">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 id="portfolio-heading" className="text-xl font-semibold uppercase tracking-widest mb-2">Our Best Work</h2>
                    <p className="text-gray-500 text-sm mb-12 max-w-xl mx-auto">
                        Best work done in past 2 months
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {PORTFOLIO_ITEMS.map((item, index) => (
                            <PortfolioItem key={index} {...item} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action with improved design */}
            <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50 text-center" aria-labelledby="cta-heading">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-light text-gray-700">
                        Don&apos;t just go with the crowd,
                    </h2>
                    <h3 id="cta-heading" className="text-3xl md:text-5xl font-bold mt-3 mb-8">
                        Just Stand Out.
                    </h3>
                    <button
                        className="mt-8 px-8 py-4 bg-black text-white text-sm font-semibold tracking-wider hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                        aria-label="Contact Us for marketing services"
                    >
                        Contact Us
                    </button>
                </div>
            </section>
        </main>
    );
};

export default ServicePage;