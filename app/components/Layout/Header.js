'use client'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight, LogIn, Briefcase, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/app/components/context/AuthProvider';

// Preloading icons to avoid layout shifts
import IconComponents from '../ui-elements/IconComponents';

const Header = () => {
    const { user, isAuthenticated, logout, isAdmin } = useAuth();
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isBlogOpen, setIsBlogOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(null);
    const servicesRef = useRef(null);
    const blogsRef = useRef(null);
    const userMenuRef = useRef(null);
    const headerRef = useRef(null);

    // Updated navigation items with Our Work added
    const navItemsLeft = [
        { label: "Contact Us", href: "/contact-us", icon: <IconComponents.MessageSquare /> },
        { label: "About Us", href: "/about-us", icon: <IconComponents.Users /> },
        { label: "Our Work", href: "/our-work", icon: <Briefcase size={18} /> }, // Added Our Work
        { label: "Careers", href: "/careers", icon: <IconComponents.Users /> },
    ];

    // Dynamic navigation items based on auth state
    const getNavItemsRight = () => {
        const baseItems = [
            {
                label: "Services",
                href: "/services",
                icon: <IconComponents.Layout />,
                hasDropdown: true,
                dropdownItems: [
                    { label: "Content Creation", href: "/services/service-1", icon: <IconComponents.Zap /> },
                    { label: "SEO Content Writer", href: "/services/service-2", icon: <IconComponents.Layout /> },
                    { label: "Sales & Marketing Automation", href: "/services/service-3", icon: <IconComponents.PenTool /> },
                    { label: "Market Research", href: "/services/service-4", icon: <IconComponents.Coffee /> },
                    { label: "Social Media Management", href: "/services/service-5", icon: <IconComponents.Users /> },
                    { label: "Offline Sales", href: "/services/service-6", icon: <IconComponents.TrendingUp /> },
                    { label: "Social Media Ads", href: "/services/service-7", icon: <IconComponents.Globe /> },
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
            }
        ];

        if (isAuthenticated && user) {
            // Show user menu when authenticated
            baseItems.push({
                label: user.name || user.email || 'User',
                href: "#",
                hasDropdown: true,
                isUserMenu: true,
                icon: <User size={18} />,
                dropdownItems: [
                    ...(isAdmin() ? [
                        { label: "Admin Dashboard", href: "/admin", icon: <Settings size={16} /> },
                        { label: "Manage Content", href: "/admin/blog", icon: <IconComponents.FileText /> },
                        { label: "Analytics", href: "/admin/analytics", icon: <IconComponents.TrendingUp /> },
                        { label: "Inquiries", href: "/admin/inquiries", icon: <IconComponents.MessageSquare /> },
                        { label: "Jobs", href: "/admin/jobs", icon: <Briefcase size={16} /> },
                    ] : []),
                    { label: "Profile", href: "/profile", icon: <User size={16} /> },
                    { label: "Logout", href: "#", icon: <LogOut size={16} />, action: 'logout' },
                ]
            });
        } else {
            // Show login when not authenticated
            baseItems.push({
                label: "Login",
                href: "/login",
                hasDropdown: false,
                icon: <LogIn size={18} />
            });
        }

        return baseItems;
    };

    const navItemsRight = getNavItemsRight();

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
                    setIsUserMenuOpen(false);
                    return;
                }

                // Check specific dropdown refs
                if (servicesRef.current && !servicesRef.current.contains(event.target)) {
                    setIsServicesOpen(false);
                }
                if (blogsRef.current && !blogsRef.current.contains(event.target)) {
                    setIsBlogOpen(false);
                }
                if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                    setIsUserMenuOpen(false);
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
                setIsUserMenuOpen(false);
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

            // Close other dropdowns if opening this one
            if (newState) {
                setIsBlogOpen(false);
                setIsUserMenuOpen(false);
            }
        } else if (menuType === "blogs") {
            const newState = forcedState !== null ? forcedState : !isBlogOpen;
            setIsBlogOpen(newState);

            // Close other dropdowns if opening this one
            if (newState) {
                setIsServicesOpen(false);
                setIsUserMenuOpen(false);
            }
        } else if (menuType === "user") {
            const newState = forcedState !== null ? forcedState : !isUserMenuOpen;
            setIsUserMenuOpen(newState);

            // Close other dropdowns if opening this one
            if (newState) {
                setIsServicesOpen(false);
                setIsBlogOpen(false);
            }
        }
    };

    const handleMenuItemClick = async (item) => {
        if (item.action === 'logout') {
            await logout();
            setIsUserMenuOpen(false);
        } else {
            setIsServicesOpen(false);
            setIsBlogOpen(false);
            setIsUserMenuOpen(false);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 relative z-50" ref={headerRef}>
            <div className="container mx-auto px-4">
                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center justify-center h-20">
                    {/* Left Side Navigation */}
                    <ul className="flex space-x-6 xl:space-x-8 2xl:space-x-12">
                        {navItemsLeft.map((item, index) => (
                            <motion.li
                                key={index}
                                className="text-black hover:text-gray-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link href={item.href} className="flex items-center gap-2 font-medium text-sm xl:text-base">
                                    {item.label}
                                </Link>
                            </motion.li>
                        ))}
                    </ul>

                    {/* Logo (centered) */}
                    <div className="mx-8 xl:mx-12 2xl:mx-16 relative h-12 w-12 xl:h-16 xl:w-16">
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
                    <ul className="flex space-x-6 xl:space-x-8 2xl:space-x-12">
                        {navItemsRight.map((item, index) => (
                            <li
                                key={index}
                                className="relative text-black hover:text-gray-700"
                                ref={item.label === "Services" ? servicesRef : item.label === "Blogs" ? blogsRef : item.isUserMenu ? userMenuRef : null}
                                onMouseEnter={() => item.hasDropdown && toggleDropdown(item.isUserMenu ? 'user' : item.label.toLowerCase(), true)}
                                onMouseLeave={() => item.hasDropdown && toggleDropdown(item.isUserMenu ? 'user' : item.label.toLowerCase(), false)}
                            >
                                {item.hasDropdown ? (
                                    <button
                                        className="flex items-center gap-2 font-medium text-sm xl:text-base"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleDropdown(item.isUserMenu ? 'user' : item.label.toLowerCase());
                                        }}
                                    >
                                        {item.isUserMenu ? (
                                            <>
                                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                    {user?.name ? user.name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <span className="max-w-32 truncate">{item.label}</span>
                                                <motion.div
                                                    animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <ChevronDown size={16} />
                                                </motion.div>
                                            </>
                                        ) : (
                                            <>
                                                {item.icon}
                                                <span>{item.label}</span>
                                                <motion.div
                                                    animate={{ rotate: (item.label === "Services" && isServicesOpen) || (item.label === "Blogs" && isBlogOpen) ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <ChevronDown size={16} />
                                                </motion.div>
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-2 font-medium text-sm xl:text-base"
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                )}

                                <AnimatePresence>
                                    {item.hasDropdown && (
                                        (item.label === "Services" && isServicesOpen) ||
                                        (item.label === "Blogs" && isBlogOpen) ||
                                        (item.isUserMenu && isUserMenuOpen)
                                    ) && (
                                            <motion.div
                                                className="absolute top-full right-0 mt-1 w-64 bg-white shadow-lg rounded-md border border-gray-200 z-50 overflow-hidden"
                                                initial="hidden"
                                                animate="visible"
                                                exit="hidden"
                                                variants={dropdownVariants}
                                            >
                                                {!item.isUserMenu && (
                                                    <>
                                                        {/* Main page link at top of dropdown */}
                                                        <div className="bg-gray-50 border-b border-gray-200">
                                                            <Link
                                                                href={item.href}
                                                                className="flex items-center gap-2 w-full px-4 py-3 text-black hover:text-gray-700 font-medium"
                                                                onClick={() => {
                                                                    setIsServicesOpen(false);
                                                                    setIsBlogOpen(false);
                                                                }}
                                                            >
                                                                {item.icon}
                                                                All {item.label}
                                                            </Link>
                                                        </div>
                                                    </>
                                                )}

                                                <ul className="py-1">
                                                    {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                                                        <motion.li
                                                            key={dropdownIndex}
                                                            className="hover:bg-gray-50"
                                                            variants={itemVariants}
                                                            whileHover={{ x: 5 }}
                                                        >
                                                            {dropdownItem.action ? (
                                                                <button
                                                                    onClick={() => handleMenuItemClick(dropdownItem)}
                                                                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-black hover:text-gray-700"
                                                                >
                                                                    {dropdownItem.icon}
                                                                    {dropdownItem.label}
                                                                </button>
                                                            ) : (
                                                                <Link
                                                                    href={dropdownItem.href}
                                                                    className="flex items-center gap-2 w-full px-4 py-2 text-black hover:text-gray-700"
                                                                    onClick={() => {
                                                                        setIsServicesOpen(false);
                                                                        setIsBlogOpen(false);
                                                                        setIsUserMenuOpen(false);
                                                                    }}
                                                                >
                                                                    {dropdownItem.icon}
                                                                    {dropdownItem.label}
                                                                </Link>
                                                            )}
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
                <div className="lg:hidden flex items-center justify-between h-16 px-2">
                    {/* Mobile Logo */}
                    <div className="relative h-10 w-10 sm:h-12 sm:w-12 z-20">
                        <Link href="/">
                            <Image
                                src="/logo.png"
                                alt="Poppy Pie Logo"
                                fill
                                priority
                                className="object-contain"
                            />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-black hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg z-20"
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
                                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 lg:hidden"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={overlayVariants}
                                onClick={() => setIsMobileMenuOpen(false)}
                            />

                            {/* Menu Container */}
                            <motion.div
                                className="fixed top-0 right-0 w-full max-w-xs sm:max-w-sm h-full bg-white z-20 lg:hidden overflow-y-auto shadow-2xl"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={mobileMenuVariants}
                            >
                                {/* Menu Header */}
                                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
                                    <div className="text-lg sm:text-xl font-medium text-black">
                                        {activeTab ? (
                                            <button
                                                onClick={() => setActiveTab(null)}
                                                className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
                                                aria-label="Back to main menu"
                                            >
                                                <ArrowRight size={18} className="rotate-180" />
                                                <span className="text-sm sm:text-base">Back</span>
                                            </button>
                                        ) : 'Poppy Pie'}
                                    </div>

                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        aria-label="Close menu"
                                        className="text-black hover:text-gray-600 transition-colors p-1 rounded-lg focus:ring-2 focus:ring-gray-200"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Main Content Area */}
                                <AnimatePresence mode="wait">
                                    {!activeTab && (
                                        <motion.div
                                            className="p-4 sm:p-6"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className="space-y-3 sm:space-y-4">
                                                {/* Home Button */}
                                                <Link
                                                    href="/"
                                                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-200 text-black hover:bg-gray-50 transition-all"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <IconComponents.Layout className="text-black" size={18} />
                                                        <span className="font-medium text-sm sm:text-base">Home</span>
                                                    </div>
                                                </Link>

                                                {/* Mobile Navigation Links */}
                                                {navItemsLeft.map((item, index) => (
                                                    <Link
                                                        key={`left-${index}`}
                                                        href={item.href}
                                                        className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-200 text-black hover:bg-gray-50 transition-all"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <span className="text-black text-lg">{item.icon}</span>
                                                            <span className="font-medium text-sm sm:text-base">{item.label}</span>
                                                        </div>
                                                    </Link>
                                                ))}

                                                {/* Services Link - Opens submenu on click */}
                                                <div
                                                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-200 text-black hover:bg-gray-50 transition-all cursor-pointer"
                                                    onClick={() => setActiveTab('services')}
                                                >
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <IconComponents.Layout className="text-black" size={18} />
                                                        <span className="font-medium text-sm sm:text-base">Services</span>
                                                    </div>
                                                    <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                </div>

                                                {/* Blogs Link - Opens submenu on click */}
                                                <div
                                                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-200 text-black hover:bg-gray-50 transition-all cursor-pointer"
                                                    onClick={() => setActiveTab('blogs')}
                                                >
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <IconComponents.PenTool className="text-black" size={18} />
                                                        <span className="font-medium text-sm sm:text-base">Blogs</span>
                                                    </div>
                                                    <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                </div>

                                                {/* Login/User Menu - Conditional rendering */}
                                                {isAuthenticated && user ? (
                                                    <div
                                                        className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-200 text-black hover:bg-gray-50 transition-all cursor-pointer"
                                                        onClick={() => setActiveTab('user')}
                                                    >
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                                                                {user?.name ? user.name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                                                            </div>
                                                            <span className="font-medium text-sm sm:text-base truncate max-w-32">{user.name || user.email || 'User'}</span>
                                                        </div>
                                                        <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                    </div>
                                                ) : (
                                                    <Link
                                                        href="/login"
                                                        className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-200 text-black hover:bg-gray-50 transition-all"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <LogIn size={18} className="text-black" />
                                                            <span className="font-medium text-sm sm:text-base">Login</span>
                                                        </div>
                                                    </Link>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Services Submenu */}
                                    {activeTab === 'services' && (
                                        <motion.div
                                            className="p-4 sm:p-6"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h3 className="font-medium text-base sm:text-lg mb-3 sm:mb-4">Services</h3>
                                            <div className="space-y-2 sm:space-y-3">
                                                {/* Main services page link */}
                                                <Link
                                                    href="/services"
                                                    className="flex items-center gap-2 sm:gap-3 p-3 rounded-lg bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 transition-colors"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <IconComponents.Layout className="text-black" size={18} />
                                                    <div>
                                                        <span className="font-medium text-sm sm:text-base">All Services</span>
                                                        <p className="text-xs sm:text-sm text-gray-600">View our complete service portfolio</p>
                                                    </div>
                                                </Link>

                                                {/* Divider */}
                                                <div className="border-t border-gray-200 my-2 sm:my-3"></div>

                                                {/* Individual service categories */}
                                                {navItemsRight[0].dropdownItems.map((item, index) => (
                                                    <Link
                                                        key={index}
                                                        href={item.href}
                                                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <span className="text-black text-lg">{item.icon}</span>
                                                        <span className="text-sm sm:text-base">{item.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Blogs Submenu */}
                                    {activeTab === 'blogs' && (
                                        <motion.div
                                            className="p-4 sm:p-6"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h3 className="font-medium text-base sm:text-lg mb-3 sm:mb-4">Blogs</h3>
                                            <div className="space-y-2 sm:space-y-3">
                                                {/* Main blogs page link */}
                                                <Link
                                                    href="/blogs"
                                                    className="flex items-center gap-2 sm:gap-3 p-3 rounded-lg bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 transition-colors"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <IconComponents.PenTool className="text-black" size={18} />
                                                    <div>
                                                        <span className="font-medium text-sm sm:text-base">All Blogs</span>
                                                        <p className="text-xs sm:text-sm text-gray-600">Browse all our blog posts</p>
                                                    </div>
                                                </Link>

                                                {/* Divider */}
                                                <div className="border-t border-gray-200 my-2 sm:my-3"></div>

                                                {/* Blog categories */}
                                                {navItemsRight[1].dropdownItems.map((item, index) => (
                                                    <Link
                                                        key={index}
                                                        href={item.href}
                                                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <span className="text-black text-lg">{item.icon}</span>
                                                        <span className="text-sm sm:text-base">{item.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* User Menu Submenu */}
                                    {activeTab === 'user' && (
                                        <motion.div
                                            className="p-4 sm:p-6"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h3 className="font-medium text-base sm:text-lg mb-3 sm:mb-4">Account Menu</h3>
                                            <div className="space-y-2 sm:space-y-3">
                                                {/* User info */}
                                                <div className="p-3 rounded-lg bg-gray-50 border-2 border-gray-200">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                            {user?.name ? user.name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-sm sm:text-base block">{user?.name || 'User'}</span>
                                                            <p className="text-xs sm:text-sm text-gray-600">{user?.email}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Divider */}
                                                <div className="border-t border-gray-200 my-2 sm:my-3"></div>

                                                {/* User menu items */}
                                                {isAdmin() && (
                                                    <>
                                                        <Link
                                                            href="/admin"
                                                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <Settings size={18} className="text-black" />
                                                            <span className="text-sm sm:text-base">Admin Dashboard</span>
                                                        </Link>
                                                        <Link
                                                            href="/admin/blog"
                                                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <IconComponents.FileText size={18} className="text-black" />
                                                            <span className="text-sm sm:text-base">Manage Content</span>
                                                        </Link>
                                                        <Link
                                                            href="/admin/analytics"
                                                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <IconComponents.TrendingUp size={18} className="text-black" />
                                                            <span className="text-sm sm:text-base">Analytics</span>
                                                        </Link>
                                                        <Link
                                                            href="/admin/inquiries"
                                                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <IconComponents.MessageSquare size={18} className="text-black" />
                                                            <span className="text-sm sm:text-base">Inquiries</span>
                                                        </Link>
                                                        <Link
                                                            href="/admin/jobs"
                                                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <Briefcase size={18} className="text-black" />
                                                            <span className="text-sm sm:text-base">Jobs</span>
                                                        </Link>

                                                        {/* Divider */}
                                                        <div className="border-t border-gray-200 my-2 sm:my-3"></div>
                                                    </>
                                                )}

                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    <User size={18} className="text-black" />
                                                    <span className="text-sm sm:text-base">Profile</span>
                                                </Link>

                                                <button
                                                    onClick={async () => {
                                                        await logout();
                                                        setIsMobileMenuOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors w-full text-left text-red-600"
                                                >
                                                    <LogOut size={18} />
                                                    <span className="text-sm sm:text-base">Logout</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Footer with copyright */}
                                <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 text-center text-gray-500 text-xs sm:text-sm px-4 sm:px-6">
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