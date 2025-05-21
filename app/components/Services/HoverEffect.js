"use client"

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const HoverEffect = ({
    items,
    className,
}) => {
    const router = useRouter();
    // Local state for hover effects
    let [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 gap-4", className)}>
            {items.map((item, idx) => (
                <Link
                    href={`/services/${item.id}`}
                    key={idx}
                    className="relative group block p-2 h-full w-full"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
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
                        <CardAction>
                            View details
                        </CardAction>
                    </Card>
                </Link>
            ))}
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
}) => {
    return (
        <motion.div
            className={cn(
                "mt-8 text-primary font-medium flex items-center text-sm cursor-pointer",
                className
            )}
            whileHover={{ x: 4 }}
        >
            {children}
            <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
        </motion.div>
    );
};