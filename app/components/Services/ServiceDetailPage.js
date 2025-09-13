"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Check, ArrowRight, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { products, services } from "@/app/components/Services/servicesData"

export default function ServiceDetailPage() {
    const router = useRouter()
    const params = useParams()
    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [relatedItems, setRelatedItems] = useState([])
    const contentRef = useRef(null)

    // Animation variants
    const headerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    }

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut", delay: 0.2 }
        }
    }

    useEffect(() => {
        // Extract service ID from the URL parameter
        const serviceId = params?.id

        if (!serviceId) {
            router.push("/services")
            return
        }

        // Search for the service in both services and products arrays
        const foundService = services.find(s => s.id === serviceId)
        const foundProduct = products.find(p => p.id === serviceId)

        const foundItem = foundService || foundProduct

        if (foundItem) {
            setItem(foundItem)

            // Determine if it's a service or product
            const isProduct = !!foundProduct

            // Get related items from the same category
            const sourceArray = isProduct ? products : services

            // Get 3 random items from the same category, excluding the current one
            const others = sourceArray
                .filter(i => i.id !== foundItem.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)

            setRelatedItems(others)
        } else {
            // If not found, redirect back to services page
            router.push("/services")
        }

        setLoading(false)

        // Scroll to top on load
        window.scrollTo(0, 0)
    }, [params, router])

    // If loading or item not found
    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!item) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Service not found</h2>
                    <Link href="/services" className="text-primary hover:underline">
                        Return to services
                    </Link>
                </div>
            </div>
        )
    }

    // Split description into paragraphs for better rendering
    const descriptionParagraphs = item.description.split('\n\n').filter(paragraph => paragraph.trim() !== '')

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative bg-muted py-16 sm:py-20 md:py-24">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                <motion.div
                    className="container mx-auto px-4 sm:px-6 relative z-10"
                    initial="hidden"
                    animate="visible"
                    variants={headerVariants}
                >
                    <Link
                        href="/services"
                        className="inline-flex items-center text-sm font-medium text-foreground hover:text-primary mb-6 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Services
                    </Link>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
                        {item.title}
                    </h1>

                    {/* Service type tag */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        {item.id.includes('product') ? 'Product' : 'Service'}
                    </div>
                </motion.div>
            </section>

            {/* Main Content Section */}
            <section className="py-12 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            ref={contentRef}
                            className="prose prose-lg max-w-none dark:prose-invert"
                            initial="hidden"
                            animate="visible"
                            variants={contentVariants}
                        >
                            {/* Description paragraphs */}
                            {descriptionParagraphs.map((paragraph, index) => (
                                <p key={index} className="mb-6 text-foreground/90 leading-relaxed">
                                    {paragraph.trim()}
                                </p>
                            ))}

                            {/* Additional Details */}
                            {item.details && (
                                <div className="mt-8 mb-8">
                                    <p className="text-foreground/80 leading-relaxed">
                                        {item.details}
                                    </p>
                                </div>
                            )}                            {/* Key Features */}
                            {item.features && (
                                <div className="mt-12 pt-8 border-t border-border">
                                    <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-0">
                                        {item.features.map((feature, i) => (
                                            <li key={i} className="flex items-start mb-3">
                                                <div className="flex-shrink-0 mr-3 mt-1">
                                                    <Check className="h-5 w-5 text-primary" />
                                                </div>
                                                <span className="text-foreground/80">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-16 bg-muted">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                            Ready to get started?
                        </h2>
                        <p className="text-foreground/80 mb-8 max-w-xl mx-auto">
                            Let&apos;s discuss how our {item.id.includes('product') ? 'product' : 'service'} can help your business grow. Contact us today for a free consultation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact-us"
                                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                                Contact Us
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                            <Link
                                href="mailto:contact@poppypie.com"
                                className="inline-flex items-center justify-center px-6 py-3 bg-background text-foreground rounded-lg font-medium border border-border hover:bg-accent transition-colors"
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Email Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Services */}
            {relatedItems.length > 0 && (
                <section className="py-12 sm:py-16">
                    <div className="container mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl font-bold mb-8 text-center">
                            You might also be interested in
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {relatedItems.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/services/${related.id}`}
                                    className="block group"
                                >
                                    <div className="bg-card rounded-xl border border-border p-6 h-full flex flex-col transition-all duration-200 hover:shadow-md hover:border-primary/20">
                                        <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                                            {related.title}
                                        </h3>
                                        <p className="text-foreground/70 text-sm flex-grow overflow-hidden text-ellipsis line-clamp-3 max-w-full">
                                            {related.description.split('\n')[0]}
                                        </p>
                                        <div className="mt-4 flex items-center text-primary text-sm font-medium">
                                            Learn more
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}