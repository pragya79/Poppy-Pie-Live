"use client"

import { useRef, lazy, Suspense } from "react"
import { motion, useInView } from "framer-motion"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import components
import ContactForm from "./ContactForm"
import Accordion from "./Acoordion"

// Lazy load HeroSection for better performance
const Hero = lazy(() => import('./Hero'))

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
}

// Contact information data with styling
const contactInfo = [
    {
        icon: <Phone className="h-5 w-5 text-gray-900" />,
        title: "Phone Number",
        info: "+91 7696834279",
        subInfo: "Monday to Friday, 9am to 6pm",
        subIcon: <Clock className="h-4 w-4 text-gray-500" />
    },
    {
        icon: <Mail className="h-5 w-5 text-gray-900" />,
        title: "Email Address",
        info: "contact@poppypie.com",
        subInfo: "We'll respond within 24 hours",
        subIcon: <Clock className="h-4 w-4 text-gray-500" />
    },
    {
        icon: <MapPin className="h-5 w-5 text-gray-900" />,
        title: "Office Location",
        info: "Mohali",
        subInfo: "Punjab, India",
        subIcon: null
    }
]

// FAQ questions data
const faqItems = [
    {
        id: "faq-1",
        question: "What services does Poppy Pie Marketing offer?",
        answer: "Poppy Pie offers comprehensive marketing services including brand strategy, visual identity design, digital experiences, content creation, and AI-powered marketing solutions. We tailor our approach to meet your specific business needs and objectives."
    },
    {
        id: "faq-2",
        question: "How do I start working with Poppy Pie?",
        answer: "Getting started is easy! Fill out the contact form, email us, or call us to schedule an initial consultation. We'll discuss your needs and develop a customized proposal for your business."
    },
    {
        id: "faq-3",
        question: "What industries do you specialize in?",
        answer: "We have expertise across many industries, with particular focus on technology, e-commerce, healthcare, finance, and professional services. Our strategic approach applies across sectors, delivering exceptional results regardless of your industry."
    },
    {
        id: "faq-4",
        question: "How long does a typical project take?",
        answer: "Project timelines vary based on scope and complexity. A brand refresh might take 4-6 weeks, while a complete rebranding with website development could take 3-4 months. We'll provide a realistic timeline during our initial consultation."
    },
    {
        id: "faq-5",
        question: "Do you offer ongoing support after project completion?",
        answer: "Absolutely! We build long-term partnerships with our clients and offer various maintenance and support packages to ensure the continued success of your marketing initiatives."
    }
]

const ContactUs = () => {
    // Refs for scroll animations
    const formRef = useRef(null)
    const infoRef = useRef(null)
    const faqRef = useRef(null)

    // Animation triggers - use smaller amount values for earlier triggering
    const isFormInView = useInView(formRef, { once: true, amount: 0.1 })
    const isInfoInView = useInView(infoRef, { once: true, amount: 0.1 })
    const isFaqInView = useInView(faqRef, { once: true, amount: 0.1 })

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section with Suspense fallback */}
            <Suspense fallback={<div className="h-64 bg-gray-900" aria-hidden="true"></div>}>
                <Hero />
            </Suspense>

            {/* Main content area */}
            <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Form section */}
                    <motion.div
                        ref={formRef}
                        className="bg-white rounded-xl shadow-md p-6 sm:p-8 md:p-10"
                        initial="hidden"
                        animate={isFormInView ? "visible" : "hidden"}
                        variants={fadeIn}
                        id="contact-form"
                    >
                        <ContactForm />
                    </motion.div>

                    {/* Info section */}
                    <div className="space-y-6">
                        {/* Contact Info Cards */}
                        <motion.div
                            ref={infoRef}
                            initial="hidden"
                            animate={isInfoInView ? "visible" : "hidden"}
                            variants={staggerContainer}
                            className="grid grid-cols-1 gap-4"
                        >
                            {contactInfo.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeIn}
                                    className="bg-white rounded-xl shadow-sm p-6 transition-shadow hover:shadow-md"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 rounded-full bg-gray-100 p-3">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-gray-700 font-medium mb-1">{item.title}</h3>
                                            <p className="text-gray-900 text-lg font-semibold mb-1">{item.info}</p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                {item.subIcon && <span className="mr-1">{item.subIcon}</span>}
                                                <span>{item.subInfo}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* FAQ Section with Optimized Accordion */}
                <motion.section
                    ref={faqRef}
                    className="mt-16 sm:mt-20"
                    initial="hidden"
                    animate={isFaqInView ? "visible" : "hidden"}
                    variants={fadeIn}
                >
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
                            <p className="text-gray-600">Find answers to common questions about our services</p>
                        </div>

                        <Accordion items={faqItems} />

                        <div className="mt-8 text-center">
                            <p className="text-gray-600 mb-4">
                                Don&apos;t see your question here? Reach out to us directly and we&apos;ll be happy to help.
                            </p>
                            <Button variant="outline"
                                className="border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                                onClick={() => {
                                    const element = document.getElementById('contact-form');
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                }}>
                                Ask Your Question
                            </Button>
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    )
}

export default ContactUs