"use client"

import { useRef, useState, lazy, Suspense } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Phone,
    Mail,
    MapPin,
    Check,
    Clock
} from "lucide-react"

// Import UI components
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Checkbox
} from "@/components/ui/checkbox"

// Import optimized components
import ContactInfoCard from "./ContactInfoCard"
import Accordion from "./Acoordion"

// Lazy load HeroSection for better performance
const Hero = lazy(() => import('./Hero'))

// Services data for select field
const serviceOptions = [
    { value: "brand-strategy", label: "Brand Strategy" },
    { value: "visual-identity", label: "Visual Identity" },
    { value: "digital-experience", label: "Digital Experience" },
    { value: "content-creation", label: "Content Creation" },
    { value: "social-media", label: "Social Media Management" },
    { value: "email-marketing", label: "Email Marketing" },
    { value: "seo", label: "SEO Optimization" },
    { value: "ppc", label: "PPC Advertising" },
    { value: "marketing-automation", label: "Marketing Automation" },
    { value: "other", label: "Other Services" }
]

// Form validation schema
const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().optional(),
    services: z.string({
        required_error: "Please select at least one service",
    }),
    subject: z.string().min(5, {
        message: "Subject must be at least 5 characters.",
    }),
    message: z.string().min(10, {
        message: "Message must be at least 10 characters.",
    }),
})

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5, // Slightly faster animation
            ease: "easeOut"
        }
    }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08, // Slightly faster stagger
            delayChildren: 0.1 // Reduced delay
        }
    }
}

// Contact information data with  styling
const contactInfo = [
    {
        icon: <Phone className="h-5 w-5 text-gray-900" />,
        title: "Phone Number",
        info: "+1 (555) 123-4567",
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
        info: "123 Marketing Avenue",
        subInfo: "New York, NY 10001, USA",
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

    // Form state
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedService, setSelectedService] = useState("")

    // React Hook Form
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            services: "",
            subject: "",
            message: "",
        }
    })

    // Handle service selection change
    const handleServiceChange = (value) => {
        setSelectedService(value)

        // Update subject with selected service if subject is empty
        const currentSubject = form.getValues("subject")
        if (!currentSubject || currentSubject === "") {
            const serviceLabel = serviceOptions.find(option => option.value === value)?.label
            if (serviceLabel) {
                form.setValue("subject", `Inquiry about ${serviceLabel}`)
            }
        }
    }

    // Handle form submission
    const onSubmit = async (values) => {
        setIsSubmitting(true)

        try {
            // Simulate API call - reduced timeout for better UX
            await new Promise(resolve => setTimeout(resolve, 600))

            console.log("Form submitted:", values)
            setFormSubmitted(true)
            form.reset()
            setSelectedService("")
        } catch (error) {
            console.error("Form submission error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

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
                        <div className="mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
                            <p className="text-gray-600">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {formSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                        <Check className="w-8 h-8 text-gray-900" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                                    <p className="text-gray-600 mb-6">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                                    <Button
                                        onClick={() => setFormSubmitted(false)}
                                        variant="outline"
                                        className="border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                                    >
                                        Send Another Message
                                    </Button>
                                </motion.div>
                            ) : (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700">Full Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="John Doe" {...field} className="border-gray-300" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700">Email Address</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="john@example.com" type="email" {...field} className="border-gray-300" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700">Phone Number (Optional)</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="+1 (555) 123-4567" type="tel" {...field} className="border-gray-300" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="services"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700">Service of Interest</FormLabel>
                                                        <Select
                                                            onValueChange={(value) => {
                                                                field.onChange(value);
                                                                handleServiceChange(value);
                                                            }}
                                                            value={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="border-gray-300">
                                                                    <SelectValue placeholder="Select a service" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {serviceOptions.map((option) => (
                                                                    <SelectItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="subject"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700">Subject</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="How can we help you?" {...field} className="border-gray-300" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700">Your Message</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Please provide details about your project or inquiry..."
                                                            className="min-h-32 resize-y border-gray-300"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="pt-2">
                                            <Button
                                                type="submit"
                                                className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? "Sending..." : "Send Message"}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            )}
                        </AnimatePresence>
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