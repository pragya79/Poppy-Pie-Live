"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Check } from "lucide-react"

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

const ContactForm = () => {
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
            // Make API call to submit contact form
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    subject: values.subject,
                    message: values.message,
                    services: selectedService,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit inquiry');
            }

            console.log("Form submitted successfully:", data)
            setFormSubmitted(true)
            form.reset()
            setSelectedService("")
        } catch (error) {
            console.error("Form submission error:", error)
            // Show error message to user
            alert(error.message || 'Failed to send message. Please try again or contact us directly.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
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
        </>
    )
}

export default ContactForm