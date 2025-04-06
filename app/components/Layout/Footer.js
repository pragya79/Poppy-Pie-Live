'use client'
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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

    // Footer link component with animation
    const FooterLink = ({ children }) => (
        <motion.li
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
            variants={itemVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
        >
            <motion.span
                variants={linkHoverVariants}
                className="inline-block"
            >
                {children}
            </motion.span>
        </motion.li>
    );

    // Column header component with animation
    const ColumnHeader = ({ children }) => (
        <motion.h3
            className="text-xl font-semibold mb-5 text-gray-800 tracking-wide"
            variants={itemVariants}
        >
            {children}
        </motion.h3>
    );

    return (
        <footer className="w-full bg-gray-200 py-16 px-6 md:px-10 border-t border-gray-300">
            <motion.div
                className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={containerVariants}
            >
                {/* Logo Column */}
                <motion.div
                    className="flex flex-col items-center md:items-start"
                    variants={itemVariants}
                >
                    <Image
                        src="/logo.png"
                        alt="Poppy Pie Logo"
                        width={64}
                        height={64}
                        priority={true}
                        className="object-contain"
                    />
                    <motion.p
                        className="text-lg font-medium text-gray-700 tracking-wide"
                        variants={itemVariants}
                    >
                        The Poppy Pie
                    </motion.p>
                </motion.div>

                {/* Products Column */}
                <div>
                    <ColumnHeader>Products</ColumnHeader>
                    <motion.ul
                        className="space-y-3"
                        variants={itemVariants}
                    >
                        <FooterLink>AI Lead Generator</FooterLink>
                        <FooterLink>AI Campaign Manager</FooterLink>
                        <FooterLink>AI Marketing Manager</FooterLink>
                    </motion.ul>
                </div>

                {/* Services Column */}
                <div>
                    <ColumnHeader>Services</ColumnHeader>
                    <motion.ul
                        className="space-y-3"
                        variants={itemVariants}
                    >
                        <FooterLink>Personal Branding</FooterLink>
                        <FooterLink>Brand Management</FooterLink>
                        <FooterLink>Growth Management</FooterLink>
                    </motion.ul>
                </div>

                {/* Navigation Column */}
                <div>
                    <ColumnHeader>Home</ColumnHeader>
                    <motion.ul
                        className="space-y-3"
                        variants={itemVariants}
                    >
                        <FooterLink>About Us</FooterLink>
                        <FooterLink>Contact Us</FooterLink>
                        <FooterLink>Blogs</FooterLink>
                    </motion.ul>
                </div>
            </motion.div>

            {/* Copyright section */}
            <motion.div
                className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-300 text-center md:text-left text-gray-600 text-sm"
                variants={itemVariants}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <p>© {new Date().getFullYear()} The Poppy Pie. All rights reserved.</p>
            </motion.div>
        </footer>
    );
};

export default Footer;