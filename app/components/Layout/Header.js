'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, ArrowRight, Zap, Coffee, Users, MessageSquare, PenTool, Layout, ExternalLink } from 'lucide-react'

const Header = () => {
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(null);
    const dropdownRef = useRef(null);

    const navItemsLeft = [
        { label: "Contact Us", href: "/contact-us", icon: <MessageSquare size={18} /> },
        { label: "About Us", href: "/about-us", icon: <Users size={18} /> },
    ]

    const navItemsRight = [
        {
            label: "Services",
            href: "/services",
            icon: <Layout size={18} />,
            hasDropdown: true,
            dropdownItems: [
                { label: "Marketing Services", href: "/services/marketing", icon: <Zap size={16} /> },
                { label: "Funnel Creation", href: "/services/funnel-creation", icon: <Layout size={16} /> },
                { label: "Branding", href: "/services/branding", icon: <PenTool size={16} /> },
                { label: "Re-Branding", href: "/services/rebranding", icon: <Coffee size={16} /> },
                { label: "Customer-Relations", href: "/services/customer-relations", icon: <Users size={16} /> },
                { label: "Content Management", href: "/services/content-management", icon: <PenTool size={16} /> },
                { label: "Social-Media Management", href: "/services/social-media", icon: <MessageSquare size={16} /> },
            ]
        },
        { label: "Blogs", href: "/blogs", icon: <PenTool size={18} /> },
    ]

    // Animation variants
    const dropdownVariants = {
        hidden: { opacity: 0, y: -5 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -5 },
        visible: { opacity: 1, y: 0 }
    };

    // 3D Cube Animation for Mobile Menu
    const cubeVariants = {
        hidden: {
            rotateY: 90,
            x: "100%",
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: [0.32, 0.72, 0, 1]
            }
        },
        visible: {
            rotateY: 0,
            x: "0%",
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: [0.32, 0.72, 0, 1],
                when: "beforeChildren"
            }
        },
        exit: {
            rotateY: -90,
            x: "100%",
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: [0.32, 0.72, 0, 1]
            }
        }
    };

    const drawerBackgroundVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    // 3D Card animation for menu items
    const card3DVariants = {
        hidden: {
            opacity: 0,
            rotateX: 45,
            y: 20,
            z: -50,
        },
        visible: (i) => ({
            opacity: 1,
            rotateX: 0,
            y: 0,
            z: 0,
            transition: {
                delay: i * 0.07,
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }),
        hover: {
            scale: 1.03,
            rotateX: -5,
            rotateY: 5,
            z: 20,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
        },
        tap: {
            scale: 0.97,
            rotateX: 0,
            z: 0,
            boxShadow: "0 5px 10px -6px rgba(0, 0, 0, 0.1)"
        }
    };

    const servicesPanelVariants = {
        hidden: {
            opacity: 0,
            rotateY: -90,
            x: 100,
            transition: { duration: 0.3 }
        },
        visible: {
            opacity: 1,
            rotateY: 0,
            x: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.07,
                when: "beforeChildren"
            }
        },
        exit: {
            opacity: 0,
            rotateY: 90,
            x: -100,
            transition: { duration: 0.3 }
        }
    };

    const serviceItemVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            rotateX: 20,
            z: -50
        },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            rotateX: 0,
            z: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.4,
                type: "spring",
                stiffness: 120
            }
        }),
        hover: {
            scale: 1.03,
            rotateX: -5,
            z: 20,
            boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)"
        },
        tap: {
            scale: 0.97,
            boxShadow: "0 5px 10px -5px rgba(0, 0, 0, 0.1)"
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsServicesOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        // Prevent scrolling when mobile menu is open
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setActiveTab(null);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <header className="bg-white border-b border-gray-200 relative z-50">
            <div className="container mx-auto px-4">
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center justify-center h-16">
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
                    <motion.div
                        className="mx-24 relative h-16 w-16"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Link href="/">
                            <Image
                                src="/logo.png" // Update with your actual logo path
                                alt="Logo"
                                fill
                                className="object-cover"
                                priority
                            />
                        </Link>
                    </motion.div>

                    {/* Right Side Navigation */}
                    <ul className="flex space-x-16">
                        {navItemsRight.map((item, index) => (
                            <motion.li
                                key={index}
                                className="text-black hover:text-gray-700 relative"
                                ref={item.hasDropdown ? dropdownRef : null}
                                onMouseEnter={() => item.hasDropdown && setIsServicesOpen(true)}
                                onMouseLeave={() => item.hasDropdown && setIsServicesOpen(false)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link href={item.href} className="flex items-center gap-2">
                                    {item.label}
                                    {item.hasDropdown && (
                                        <motion.div
                                            animate={{ rotate: isServicesOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown size={16} />
                                        </motion.div>
                                    )}
                                </Link>

                                <AnimatePresence>
                                    {item.hasDropdown && isServicesOpen && (
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
                                                        <Link href={dropdownItem.href} className="flex items-center gap-2 w-full px-4 py-2 text-black hover:text-gray-700">
                                                            {React.cloneElement(dropdownItem.icon, { className: "text-black" })}
                                                            {dropdownItem.label}
                                                        </Link>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.li>
                        ))}
                    </ul>
                </nav>

                {/* Mobile Navigation Header */}
                <div className="md:hidden flex items-center justify-between h-16">
                    {/* Mobile Logo */}
                    <motion.div
                        className="relative h-8 w-8 z-20"
                        whileTap={{ scale: 0.9 }}
                    >
                        <Link href="/">
                            <Image
                                src="/logo.png" // Update with your actual logo path
                                alt="Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </motion.div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-black hover:text-gray-700 focus:outline-none z-20"
                        whileTap={{ scale: 0.9 }}
                    >
                        {isMobileMenuOpen ? (
                            <X size={24} className="text-black" />
                        ) : (
                            <Menu size={24} />
                        )}
                    </motion.button>
                </div>

                {/* 3D Mobile Menu Animation with Black & White Theme */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            {/* Background overlay */}
                            <motion.div
                                className="fixed inset-0 bg-black/10 bg-opacity-20 backdrop-blur-sm z-10 md:hidden"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={drawerBackgroundVariants}
                                onClick={() => setIsMobileMenuOpen(false)}
                            />

                            {/* 3D Cube Effect Menu Container */}
                            <div className="fixed inset-0 pointer-events-none perspective-1000 z-20 md:hidden">
                                <motion.div
                                    className="absolute top-0 right-0 w-full max-w-sm h-full bg-white pointer-events-auto origin-right overflow-hidden"
                                    style={{
                                        transformStyle: "preserve-3d",
                                        backfaceVisibility: "hidden"
                                    }}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={cubeVariants}
                                >
                                    {/* Menu Header */}
                                    <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-xl font-medium text-black"
                                        >
                                            {activeTab ? (
                                                <button
                                                    onClick={() => setActiveTab(null)}
                                                    className="flex items-center gap-2 text-black"
                                                >
                                                    <ArrowRight size={20} className="rotate-180" />
                                                    Back
                                                </button>
                                            ) : 'Poppy Pie'}
                                        </motion.div>

                                        <motion.button
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            whileTap={{ scale: 0.9 }}
                                            className="text-black"
                                        >
                                            <X size={24} />
                                        </motion.button>
                                    </div>

                                    {/* Main Content Area with 3D Perspective */}
                                    <div className="perspective-1000">
                                        <AnimatePresence mode="wait">
                                            {!activeTab && (
                                                <motion.div
                                                    className="p-6"
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    variants={servicesPanelVariants}
                                                    key="main-menu"
                                                    style={{ transformStyle: "preserve-3d" }}
                                                >
                                                    <div className="space-y-4">
                                                        {/* Home Button */}
                                                        <motion.div
                                                            custom={0}
                                                            variants={card3DVariants}
                                                            whileHover="hover"
                                                            whileTap="tap"
                                                            style={{ transformStyle: "preserve-3d" }}
                                                        >
                                                            <Link
                                                                href="/"
                                                                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 text-black hover:bg-gray-50 transition-all"
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <Layout size={20} className="text-black" />
                                                                    <span className="font-medium">Home</span>
                                                                </div>
                                                                <ExternalLink size={16} className="text-black" />
                                                            </Link>
                                                        </motion.div>

                                                        {/* Basic Navigation Links */}
                                                        {[...navItemsLeft, ...navItemsRight.filter(item => !item.hasDropdown)].map((item, index) => (
                                                            <motion.div
                                                                key={index}
                                                                custom={index + 1}
                                                                variants={card3DVariants}
                                                                whileHover="hover"
                                                                whileTap="tap"
                                                                style={{ transformStyle: "preserve-3d" }}
                                                            >
                                                                <Link
                                                                    href={item.href}
                                                                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 text-black hover:bg-gray-50 transition-all"
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        {React.cloneElement(item.icon, { className: "text-black" })}
                                                                        <span className="font-medium">{item.label}</span>
                                                                    </div>
                                                                    <ExternalLink size={16} className="text-black" />
                                                                </Link>
                                                            </motion.div>
                                                        ))}

                                                        {/* Services (with dropdown) */}
                                                        {navItemsRight.filter(item => item.hasDropdown).map((item, index) => (
                                                            <motion.div
                                                                key={`dropdown-${index}`}
                                                                custom={navItemsLeft.length + navItemsRight.filter(item => !item.hasDropdown).length + index + 1}
                                                                variants={card3DVariants}
                                                                whileHover="hover"
                                                                whileTap="tap"
                                                                style={{ transformStyle: "preserve-3d" }}
                                                            >
                                                                <button
                                                                    onClick={() => setActiveTab('services')}
                                                                    className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-900 bg-gray-900 text-white transition-all"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        {item.icon && React.cloneElement(item.icon, { size: 20, className: "text-white" })}
                                                                        <span className="font-medium">{item.label}</span>
                                                                    </div>
                                                                    <ArrowRight size={16} className="text-white" />
                                                                </button>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Services Panel View */}
                                            {activeTab === 'services' && (
                                                <motion.div
                                                    className="p-6"
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    variants={servicesPanelVariants}
                                                    key="services-panel"
                                                    style={{ transformStyle: "preserve-3d" }}
                                                >
                                                    <div className="space-y-4">
                                                        {navItemsRight.find(item => item.hasDropdown)?.dropdownItems.map((service, index) => (
                                                            <motion.div
                                                                key={index}
                                                                custom={index}
                                                                variants={serviceItemVariants}
                                                                whileHover="hover"
                                                                whileTap="tap"
                                                                style={{ transformStyle: "preserve-3d" }}
                                                            >
                                                                <Link
                                                                    href={service.href}
                                                                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 text-black hover:bg-gray-50 transition-all"
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="bg-gray-900 p-2 rounded-md">
                                                                            {React.cloneElement(service.icon, { className: "text-white", size: 16 })}
                                                                        </div>
                                                                        <span>{service.label}</span>
                                                                    </div>
                                                                    <ExternalLink size={16} className="text-black" />
                                                                </Link>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Footer with copyright */}
                                    <motion.div
                                        className="absolute bottom-8 left-0 right-0 text-center text-gray-500 text-sm px-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <p>© 2025 Your Company</p>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </header>
    )
}

export default Header