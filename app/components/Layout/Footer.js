'use client'
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight, ExternalLink, Youtube } from 'lucide-react';

const Footer = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
                duration: 0.5
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 10 }
        }
    };

    const linkHoverVariants = {
        hover: { x: 5, transition: { duration: 0.2 } }
    };

    // Services with query parameters for direct modal opening
    const serviceLinks = [
        { name: "Content Creation", href: "/services?service=service-1" },
        { name: "SEO Content Writing", href: "/services?service=service-2" },
        { name: "Sales & Marketing", href: "/services?service=service-3" },
        { name: "Market Research", href: "/services?service=service-4" },
        { name: "Social Media Management", href: "/services?service=service-5" },
    ];

    // Products with query parameters for direct modal opening
    const productLinks = [
        { name: "AI Marketing Manager", href: "/services?product=product-1" },
        { name: "AI Lead Generator", href: "/services?product=product-2" },
        { name: "AI Web Scraper", href: "/services?product=product-3" },
        { name: "AI Campaign Manager", href: "/services?product=product-4" },
    ];

    // Footer link component with animation
    const FooterLink = ({ children, href, isExternal = false }) => (
        <motion.li
            className="mb-2.5 last:mb-0"
            variants={itemVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
        >
            <Link href={href} className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center group">
                <ArrowRight className="h-3.5 w-3.5 mr-2 text-gray-400 group-hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200 -ml-5 group-hover:ml-0" />
                <motion.span variants={linkHoverVariants} className="text-sm inline-block">
                    {children}
                </motion.span>
                {isExternal && <ExternalLink className="ml-1 h-3 w-3 text-gray-400" />}
            </Link>
        </motion.li>
    );

    // Column header component with animation
    const ColumnHeader = ({ children }) => (
        <motion.h3
            className="text-base font-semibold mb-4 text-gray-800 tracking-wide border-b border-gray-300 pb-2"
            variants={itemVariants}
        >
            {children}
        </motion.h3>
    );

    return (
        <footer className="bg-gray-200">
            {/* Main Footer Content */}
            <div className="w-full py-12 px-6 md:px-10 border-t border-gray-300">
                <motion.div
                    className="max-w-6xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    {/* Top Section with Logo and Newsletter */}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 pb-10 border-b border-gray-300">
                        <motion.div className="mb-8 md:mb-0 text-center md:text-left" variants={itemVariants}>
                            <div className="bg-white p-4 rounded-full shadow-md inline-block mb-4">
                                <Image
                                    src="/logo.png"
                                    alt="Poppy Pie Logo"
                                    width={70}
                                    height={70}
                                    priority={true}
                                    className="object-contain"
                                />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Poppy Pie</h2>
                            <p className="text-gray-600 max-w-xs text-sm leading-relaxed">
                                Innovative marketing and branding solutions to help your business grow and thrive in today&apos;s competitive landscape.
                            </p>

                            <div className="mt-4 pt-4 border-t border-gray-300 inline-block">
                                <a
                                    href="/contact-us"
                                    className="inline-flex items-center text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
                                >
                                    <span>Get a free consultation</span>
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                            </div>
                        </motion.div>

                        <motion.div className="w-full md:w-[280px] bg-white rounded-lg shadow-md p-4" variants={itemVariants}>
                            <h3 className="text-base font-medium text-gray-800 mb-2">Subscribe to our newsletter</h3>
                            <p className="text-xs text-gray-500 mb-3">Get the latest marketing insights delivered to your inbox</p>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                />
                                <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm font-medium">
                                    Subscribe
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2">
                                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                            </p>
                        </motion.div>
                    </div>

                    {/* Main Footer Links Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {/* Company Information */}
                        <div>
                            <ColumnHeader>Contact Us</ColumnHeader>
                            <motion.ul variants={itemVariants} className="space-y-4 mb-6">
                                <li className="flex items-start bg-white/50 p-2 rounded-md">
                                    <MapPin className="h-5 w-5 mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-600">
                                        Mohali, Punjab, India
                                    </span>
                                </li>

                                {/* Copyable Phone Number */}
                                <li>
                                    <motion.div
                                        className="flex items-center group relative bg-white p-3 rounded-md hover:shadow-md transition-all duration-200 border border-transparent hover:border-gray-200"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Phone className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
                                        <div className="flex-grow">
                                            <button
                                                onClick={(e) => {
                                                    navigator.clipboard.writeText("+91 7696834279");
                                                    const btn = e.currentTarget;
                                                    const originalContent = btn.innerHTML;
                                                    btn.innerHTML = `<span class="text-sm text-green-600 font-medium">+91 7696834279</span>
                                        <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center">
                                            Copied!
                                        </span>`;
                                                    setTimeout(() => {
                                                        btn.innerHTML = originalContent;
                                                    }, 2000);
                                                }}
                                                className="flex items-center w-full justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 rounded-sm"
                                                aria-label="Copy phone number to clipboard"
                                            >
                                                <span className="text-sm text-gray-700 font-medium">+91 7696834279</span>
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy">
                                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                                    </svg>
                                                    Copy
                                                </span>
                                            </button>
                                        </div>
                                    </motion.div>
                                </li>

                                {/* Copyable Email Address */}
                                <li>
                                    <motion.div
                                        className="flex items-center group relative bg-white p-3 rounded-md hover:shadow-md transition-all duration-200 border border-transparent hover:border-gray-200"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Mail className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
                                        <div className="flex-grow overflow-hidden">
                                            <button
                                                onClick={(e) => {
                                                    navigator.clipboard.writeText("contact@poppypie.com");
                                                    // Show temporary feedback in the button
                                                    const btn = e.currentTarget;
                                                    const originalContent = btn.innerHTML;
                                                    btn.innerHTML = `<div class="flex items-center justify-between w-full">
                        <span class="text-sm text-green-600 font-medium truncate mr-2">contact@poppypie.com</span>
                        <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center flex-shrink-0">
                            Copied!
                        </span>
                    </div>`;
                                                    setTimeout(() => {
                                                        btn.innerHTML = originalContent;
                                                    }, 2000);
                                                }}
                                                className="flex items-center w-full justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 rounded-sm"
                                                aria-label="Copy email address to clipboard"
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="text-sm text-gray-700 font-medium truncate mr-2">contact@poppypie.com</span>
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy">
                                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                                        </svg>
                                                        Copy
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    </motion.div>
                                </li>
                            </motion.ul>

                            {/* Social Media Section - Improved */}
                            <motion.div
                                className="mt-6 bg-white p-5 rounded-lg shadow-sm border border-gray-100"
                                variants={itemVariants}
                                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                            >
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                    <span className="w-8 h-1 bg-gray-800 mr-2 rounded-full"></span>
                                    Follow Us On Social Media
                                </h4>
                                <div className="flex space-x-3">
                                    <motion.a
                                        href="https://www.youtube.com/@ThePoppyPie-nt"
                                        className="bg-gray-100 hover:bg-red-50 p-2 rounded-full text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center justify-center"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Youtube className="h-5 w-5" />
                                    </motion.a>
                                    <motion.a
                                        href="https://www.instagram.com/thepoppypie"
                                        className="bg-gray-100 hover:bg-purple-50 p-2 rounded-full text-gray-600 hover:text-purple-600 transition-colors duration-200 flex items-center justify-center"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Instagram className="h-5 w-5" />
                                    </motion.a>
                                    <motion.a
                                        href="https://www.linkedin.com/company/the-poppy-pie/"
                                        className="bg-gray-100 hover:bg-blue-50 p-2 rounded-full text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </motion.a>
                                </div>
                                <p className="text-xs text-gray-500 mt-3">
                                    Stay updated with our latest news and offerings
                                </p>
                            </motion.div>
                        </div>

                        {/* Products Column */}
                        <div>
                            <ColumnHeader>Products</ColumnHeader>
                            <motion.ul
                                className="space-y-1 pl-5"
                                variants={itemVariants}
                            >
                                {productLinks.map((link, index) => (
                                    <FooterLink key={index} href={link.href}>
                                        {link.name}
                                    </FooterLink>
                                ))}
                                <FooterLink href="/services">View All Products</FooterLink>
                            </motion.ul>
                        </div>

                        {/* Services Column */}
                        <div>
                            <ColumnHeader>Services</ColumnHeader>
                            <motion.ul
                                className="space-y-1 pl-5"
                                variants={itemVariants}
                            >
                                {serviceLinks.map((link, index) => (
                                    <FooterLink key={index} href={link.href}>
                                        {link.name}
                                    </FooterLink>
                                ))}
                                <FooterLink href="/services">View All Services</FooterLink>
                            </motion.ul>
                        </div>

                        {/* Navigation Column */}
                        <div>
                            <ColumnHeader>Quick Links</ColumnHeader>
                            <motion.ul
                                className="space-y-1 pl-5"
                                variants={itemVariants}
                            >
                                <FooterLink href="/">Home</FooterLink>
                                <FooterLink href="/about-us">About Us</FooterLink>
                                <FooterLink href="/contact-us">Contact Us</FooterLink>
                                <FooterLink href="/blogs">Blogs</FooterLink>
                                <FooterLink href="careers">Careers</FooterLink>
                                <FooterLink href="#">FAQ</FooterLink>
                            </motion.ul>

                            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm font-medium text-gray-800 mb-2">Working Hours</p>
                                <p className="text-xs text-gray-600">Monday - Friday: 9am - 6pm</p>
                                <p className="text-xs text-gray-600">Saturday: 10am - 2pm</p>
                                <p className="text-xs text-gray-600">Sunday: Closed</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Bar with Copyright */}
            <div className="w-full py-4 bg-gray-900 text-gray-300">
                <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm">© {new Date().getFullYear()} Poppy Pie. All rights reserved.</p>
                    <div className="mt-3 sm:mt-0">
                        <ul className="flex space-x-6 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-200">Sitemap</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;