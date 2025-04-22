"use client"

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, X } from "lucide-react";

export const HoverEffect = ({
    items,
    className
}) => {
    let [hoveredIndex, setHoveredIndex] = useState(null);
    let [modalOpen, setModalOpen] = useState(false);
    let [selectedItem, setSelectedItem] = useState(null);

    // Close modal when escape key is pressed
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && modalOpen) {
                setModalOpen(false);
            }
        };

        window.addEventListener('keydown', handleEscKey);

        // Remove scroll from body when modal is open
        if (modalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            window.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset';
        };
    }, [modalOpen]);

    const handleKnowMore = (e, item, index) => {
        e.preventDefault();
        setSelectedItem(item);
        setModalOpen(true);
    };

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 gap-4", className)}>
            {items.map((item, idx) => (
                <Link
                    href={item?.link || "#"}
                    key={idx}
                    className="relative group block p-2 h-full w-full"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={(e) => e.preventDefault()}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.span
                                className="absolute inset-0 h-full w-full bg-accent dark:bg-accent/30 block rounded-3xl"
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    transition: { duration: 0.15 },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15, delay: 0.2 },
                                }}
                            />
                        )}
                    </AnimatePresence>

                    <Card>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                        {item.action && (
                            <CardAction onClick={(e) => handleKnowMore(e, item, idx)}>
                                {item.action}
                            </CardAction>
                        )}
                    </Card>
                </Link>
            ))}

            {/* Modal overlay - Updated z-index to 100 (higher than header's z-index of 50) */}
            <AnimatePresence>
                {modalOpen && selectedItem && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                            onClick={() => setModalOpen(false)}
                        />

                        <motion.div
                            className="fixed z-[101] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-3xl max-h-[85vh] bg-card rounded-2xl shadow-lg overflow-hidden"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            <div className="p-6 overflow-y-auto max-h-[85vh]">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="p-2 hover:bg-accent rounded-full transition-colors"
                                        aria-label="Close modal"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="prose prose-gray dark:prose-invert max-w-none">
                                    {/* Improved description rendering with proper paragraph breaks */}
                                    <div className="text-base text-muted-foreground leading-relaxed mb-6">
                                        {selectedItem.description.split('\n').map((paragraph, index) => (
                                            paragraph.trim() ? (
                                                <p key={index} className="mb-4 last:mb-0">
                                                    {paragraph}
                                                </p>
                                            ) : <div key={index} className="h-4" /> // Empty line spacer
                                        ))}
                                    </div>

                                    {selectedItem.features && (
                                        <div className="mt-6 pt-6 border-t border-border">
                                            <h3 className="text-lg font-medium mb-3">Key Features</h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-0 mt-4">
                                                {selectedItem.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                                        <span className="text-muted-foreground text-sm">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="mt-8 pt-4 flex justify-end">
                                        <Link href={'/contact-us'}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-medium flex items-center"
                                            >
                                                Get Started
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </motion.button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export const Card = ({
    className,
    children
}) => {
    return (
        <div
            className={cn(
                "rounded-2xl h-full w-full p-4 overflow-hidden bg-card text-card-foreground border border-border group-hover:border-primary/20 relative z-20 shadow-sm",
                className
            )}
        >
            <div className="relative z-20">
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

export const CardTitle = ({
    className,
    children
}) => {
    return (
        <h4 className={cn("font-bold tracking-wide mt-4", className)}>
            {children}
        </h4>
    );
};

export const CardDescription = ({
    className,
    children
}) => {
    return (
        <p
            className={cn("mt-4 text-muted-foreground tracking-wide leading-relaxed text-sm line-clamp-4", className)}
        >
            {children}
        </p>
    );
};

export const CardAction = ({
    className,
    children,
    onClick
}) => {
    return (
        <motion.button
            onClick={onClick}
            className={cn(
                "mt-8 text-primary font-medium flex items-center text-sm cursor-pointer",
                className
            )}
            whileHover={{ x: 4 }}
        >
            {children}
            <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
        </motion.button>
    );
};