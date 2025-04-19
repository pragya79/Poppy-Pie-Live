'use client'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight, LogIn } from 'lucide-react';

// Preloading icons to avoid layout shifts
import IconComponents from '../IconComponents';

const Header = () => {
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isBlogOpen, setIsBlogOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(null);
    const servicesRef = useRef(null);
    const blogsRef = useRef(null);
    const headerRef = useRef(null);

    // Reduced navigation items with icons imported from IconComponents
    const navItemsLeft = [
        { label: "Contact Us", href: "/contact-us", icon: <IconComponents.MessageSquare /> },
        { label: "About Us", href: "/about-us", icon: <IconComponents.Users /> },
        { label: "Carriers", href: "/carriers", icon: <IconComponents.Users /> },
    ];

    const navItemsRight = [
        {
            label: "Services",
            href: "/services",
            icon: <IconComponents.Layout />,
            hasDropdown: true,
            dropdownItems: [
                { label: "Marketing Services", href: "/services/marketing", icon: <IconComponents.Zap /> },
                { label: "Funnel Creation", href: "/services/funnel-creation", icon: <IconComponents.Layout /> },
                { label: "Branding", href: "/services/branding", icon: <IconComponents.PenTool /> },
                { label: "Re-Branding", href: "/services/rebranding", icon: <IconComponents.Coffee /> },
                { label: "Customer-Relations", href: "/services/customer-relations", icon: <IconComponents.Users /> },
            ]
        },
        {
            label: "Blogs",
            href: "/blogs",
            icon: <IconComponents.PenTool />,
            hasDropdown: true,
            dropdownItems: [
                { label: "Digital Marketing", href: "/blogs/digital-marketing", icon: <IconComponents.Globe /> },
                { label: "Content Marketing", href: "/blogs/content-marketing", icon: <IconComponents.FileText /> },
                { label: "Social Media", href: "/blogs/social-media", icon: <IconComponents.Users /> },
                { label: "Sales Strategies", href: "/blogs/sales-strategies", icon: <IconComponents.TrendingUp /> },
            ]
        },
        {
            label: "Login",
            href: "/login",
            hasDropdown: false,
            icon: <LogIn size={18} />
        }
    ];

    // Optimized animation variants
    const dropdownVariants = {
        hidden: { opacity: 0, y: -5, height: 0 },
        visible: {
            opacity: 1,
            y: 0,
            height: 'auto',
            transition: {
                duration: 0.25,
                staggerChildren: 0.04
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -5 },
        visible: { opacity: 1, y: 0 }
    };

    // Mobile menu animation
    const mobileMenuVariants = {
        hidden: { x: '100%' },
        visible: {
            x: 0,
            transition: {
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        exit: {
            x: '100%',
            transition: {
                duration: 0.2,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Only process click outside if we're not in mobile menu mode
            if (!isMobileMenuOpen) {
                // If the click is outside the header entirely, close all dropdowns
                if (headerRef.current && !headerRef.current.contains(event.target)) {
                    setIsServicesOpen(false);
                    setIsBlogOpen(false);
                    return;
                }

                // Check specific dropdown refs
                if (servicesRef.current && !servicesRef.current.contains(event.target)) {
                    setIsServicesOpen(false);
                }
                if (blogsRef.current && !blogsRef.current.contains(event.target)) {
                    setIsBlogOpen(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    // Handle mobile menu scroll locking
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setActiveTab(null);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    // Handle ESC key to close dropdown and mobile menu
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                setIsServicesOpen(false);
                setIsBlogOpen(false);
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, []);

    const toggleDropdown = (menuType, forcedState = null) => {
        if (menuType === "services") {
            // If forcedState is provided, use it, otherwise toggle
            const newState = forcedState !== null ? forcedState : !isServicesOpen;
            setIsServicesOpen(newState);

            // Close other dropdown if opening this one
            if (newState) setIsBlogOpen(false);
        } else if (menuType === "blogs") {
            const newState = forcedState !== null ? forcedState : !isBlogOpen;
            setIsBlogOpen(newState);

            // Close other dropdown if opening this one
            if (newState) setIsServicesOpen(false);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 relative z-50" ref={headerRef}>
            <div className="container mx-auto px-4">
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center justify-center h-20">
                    {/* Left Side Navigation */}
                    <ul className="flex space-x-16">
                        {navItemsLeft.map((item, index) => (
                            <motion.li
                                key={index}
                                className="text-black hover:text-gray-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link href={item.href} className="flex items-center gap-2">
                                    {item.label}
                                </Link>
                            </motion.li>
                        ))}
                    </ul>

                    {/* Logo (centered) */}
                    <div className="mx-24 relative h-16 w-16">
                        <Link href="/">
                            <Image
                                src="/logo.png"
                                alt="Poppy Pie Logo"
                                width={64}
                                height={64}
                                priority
                                className="object-contain"
                            />
                        </Link>
                    </div>

                    {/* Right Side Navigation */}
                    <ul className="flex space-x-16">
                        {navItemsRight.map((item, index) => (
                            <li
                                key={index}
                                className="relative text-black hover:text-gray-700"
                                ref={item.label === "Services" ? servicesRef : item.label === "Blogs" ? blogsRef : null}
                                onMouseEnter={() => item.hasDropdown && toggleDropdown(item.label.toLowerCase(), true)}
                                onMouseLeave={() => item.hasDropdown && toggleDropdown(item.label.toLowerCase(), false)}
                            >
                                <Link
                                    href={item.hasDropdown ? "#" : item.href}
                                    className="flex items-center gap-2"
                                    onClick={(e) => {
                                        if (item.hasDropdown) {
                                            e.preventDefault(); // Prevent navigation when dropdown is available
                                            toggleDropdown(item.label.toLowerCase());
                                        }
                                    }}
                                >
                                    {item.label}
                                    {item.hasDropdown && (
                                        <motion.div
                                            animate={{ rotate: (item.label === "Services" && isServicesOpen) || (item.label === "Blogs" && isBlogOpen) ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown size={16} />
                                        </motion.div>
                                    )}
                                </Link>

                                <AnimatePresence>
                                    {item.hasDropdown && ((item.label === "Blogs" && isBlogOpen) || (item.label === "Services" && isServicesOpen)) && (
                                        <motion.div
                                            className="absolute top-full right-0 mt-1 w-64 bg-white shadow-lg rounded-md border border-gray-200 z-50 overflow-hidden"
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            variants={dropdownVariants}
                                        >
                                            <ul className="py-1">
                                                {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                                                    <motion.li
                                                        key={dropdownIndex}
                                                        className="hover:bg-gray-50"
                                                        variants={itemVariants}
                                                        whileHover={{ x: 5 }}
                                                    >
                                                        <Link
                                                            href={dropdownItem.href}
                                                            className="flex items-center gap-2 w-full px-4 py-2 text-black hover:text-gray-700"
                                                            onClick={() => {
                                                                setIsServicesOpen(false);
                                                                setIsBlogOpen(false);
                                                            }}
                                                        >
                                                            {dropdownItem.icon}
                                                            {dropdownItem.label}
                                                        </Link>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Mobile Navigation Header */}
                <div className="md:hidden flex items-center justify-between h-16">
                    {/* Mobile Logo */}
                    <div className="relative h-8 w-8 z-20">
                        <Link href="/">
                            <Image
                                src="/logo.png"
                                alt="Poppy Pie Logo"
                                width={32}
                                height={32}
                                priority
                                className="object-contain"
                            />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-black hover:text-gray-700 focus:outline-none z-20"
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMobileMenuOpen ? (
                            <X size={24} className="text-black" />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            {/* Background overlay */}
                            <motion.div
                                className="fixed inset-0 bg-black/10 backdrop-blur-sm z-10 md:hidden"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={overlayVariants}
                                onClick={() => setIsMobileMenuOpen(false)}
                            />

                            {/* Menu Container */}
                            <motion.div
                                className="fixed top-0 right-0 w-full max-w-sm h-full bg-white z-20 md:hidden overflow-y-auto"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={mobileMenuVariants}
                            >
                                {/* Menu Header */}
                                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                    <div className="text-xl font-medium text-black">
                                        {activeTab ? (
                                            <button
                                                onClick={() => setActiveTab(null)}
                                                className="flex items-center gap-2 text-black"
                                                aria-label="Back to main menu"
                                            >
                                                <ArrowRight size={20} className="rotate-180" />
                                                Back
                                            </button>
                                        ) : 'Poppy Pie'}
                                    </div>

                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        aria-label="Close menu"
                                        className="text-black"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Main Content Area */}
                                <AnimatePresence mode="wait">
                                    {!activeTab && (
                                        <motion.div
                                            className="p-6"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className="space-y-4">
                                                {/* Home Button */}
                                                <Link
                                                    href="/"
                                                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 text-black hover:bg-gray-50 transition-all"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <IconComponents.Layout className="text-black" />
                                                        <span className="font-medium">Home</span>
                                                    </div>
                                                </Link>

                                                {/* Mobile Navigation Links */}
                                                {navItemsLeft.map((item, index) => (
                                                    <Link
                                                        key={`left-${index}`}
                                                        href={item.href}
                                                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 text-black hover:bg-gray-50 transition-all"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {item.icon}
                                                            <span className="font-medium">{item.label}</span>
                                                        </div>
                                                    </Link>
                                                ))}

                                                {/* Mobile Dropdown Navigation */}
                                                {navItemsRight.map((item, index) => (
                                                    <div key={`right-${index}`}>
                                                        {item.hasDropdown ? (
                                                            <div
                                                                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 text-black hover:bg-gray-50 transition-all cursor-pointer"
                                                                onClick={() => setActiveTab(item.label)}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    {item.icon}
                                                                    <span className="font-medium">{item.label}</span>
                                                                </div>
                                                                <ArrowRight size={16} />
                                                            </div>
                                                        ) : (
                                                            <Link
                                                                href={item.href}
                                                                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 text-black hover:bg-gray-50 transition-all"
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    {item.icon}
                                                                    <span className="font-medium">{item.label}</span>
                                                                </div>
                                                            </Link>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Submenu Content */}
                                    {activeTab && (
                                        <motion.div
                                            className="p-6"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <h3 className="text-lg font-medium mb-4">{activeTab}</h3>
                                            <div className="space-y-3">
                                                {navItemsRight.find(item => item.label === activeTab)?.dropdownItems.map((subItem, subIndex) => (
                                                    <Link
                                                        key={subIndex}
                                                        href={subItem.href}
                                                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        {subItem.icon}
                                                        <span>{subItem.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Footer with copyright */}
                                <div className="absolute bottom-8 left-0 right-0 text-center text-gray-500 text-sm px-6">
                                    <p>© {new Date().getFullYear()} Poppy Pie</p>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Header;