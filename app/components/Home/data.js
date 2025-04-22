/**
 * Testimonial images data for the carousel
 */
export const TESTIMONIAL_IMAGES = [
    {
        id: 1,
        bgImage: '/testimonials/t1.png',
        alt: "Client testimonial from Company ABC about their successful digital marketing campaign",
        name: "John Doe, ABC Inc."
    },
    {
        id: 2,
        bgImage: '/testimonials/t2.png',
        alt: "Client testimonial from XYZ Ltd showcasing their brand transformation",
        name: "Jane Smith, XYZ Ltd."
    },
    {
        id: 3,
        bgImage: '/testimonials/t3.png',
        alt: "Testimonial from a startup describing their marketing journey",
        name: "Alex Johnson, Startup Co."
    },
    {
        id: 4,
        bgImage: '/testimonials/t4.png',
        alt: "Corporate client feedback on strategic brand positioning",
        name: "Sarah Williams, Corporate Inc."
    },
];

/**
 * Portfolio items data for showcase section
 */
export const PORTFOLIO_ITEMS = [
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

/**
 * Animation variants for consistent animations
 */
export const animations = {
    fadeIn: {
        hidden: { opacity: 0, y: 16 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    },
    fadeInLeft: {
        hidden: { opacity: 0, x: -25 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    },
    fadeInRight: {
        hidden: { opacity: 0, x: 25 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    },
    staggerContainer: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    },
    staggerItem: {
        hidden: { opacity: 0, y: 16 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    }
};

/**
 * Collections data for the grid section
 */
export const COLLECTIONS = [
    {
        title: "Brands We Have Worked With",
        text: [
            "Worked with 10+ brands.",
            "Experienced in building and executing brand strategies.",
            "Collaborated with companies like Business Enablers, Profess, Eduacademy, and Uniqus.",
            "Contributed to a project in association with Harvard University.",
            "Strong understanding of branding implementation in real scenarios.",
        ],
        img: '/collections/BWHWW.jpg',
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
        img: '/collections/CC.jpg',
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
        img: '/collections/T.jpg',
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
        img: '/collections/BS.jpg',
        alt: "Visual representation of brand strategy implementations and campaign results across multiple projects",
    },
];
