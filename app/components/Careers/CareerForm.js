"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Check, Upload, Info } from "lucide-react"
import { useServicesData } from "./useServiceData"

// Import UI components
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// Form validation schema
const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
        message: "Please enter a valid phone number.",
    }),
    position: z.string({
        required_error: "Please select a position you're applying for",
    }),
    experience: z.string().min(1, {
        message: "Please enter your years of experience.",
    }),
    portfolio: z.string().url().optional().or(z.literal("")),
    resume: z.any()
        .refine((file) => file?.length > 0, "Resume is required")
        .refine(
            (file) => {
                if (!file?.[0]) return true;
                return file[0].size <= 5000000; // 5MB
            },
            "Max file size is 5MB"
        )
        .refine(
            (file) => {
                if (!file?.[0]) return true;
                return ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file[0].type);
            },
            "Only PDF, DOC and DOCX files are accepted"
        ),
    cover_letter: z.string().min(50, {
        message: "Cover letter must be at least 50 characters.",
    }),
});

const CareerForm = () => {
    // Form state
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [fileName, setFileName] = useState("")
    const { services, loading, error } = useServicesData()

    // React Hook Form
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            position: "",
            experience: "",
            portfolio: "",
            resume: undefined,
            cover_letter: "",
        }
    })

    // Handle form submission
    const onSubmit = async (values) => {
        setIsSubmitting(true)

        try {
            // In a real app, this would be an API call to handle the form submission
            // And likely would use FormData to handle the file upload

            console.log("Form submitted:", values)

            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 1500))

            setFormSubmitted(true)
            form.reset()
            setFileName("")
        } catch (error) {
            console.error("Form submission error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle file change
    const handleFileChange = (e, onChange) => {
        const files = e.target.files
        if (files?.length > 0) {
            onChange(files)
            setFileName(files[0].name)
        }
    }

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

    return (
        <>
            <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Join Our Team</h2>
                <p className="text-gray-600">Fill out the form below to apply for a position at Poppy Pie</p>
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                        <p className="text-gray-600 mb-6">Thank you for your interest in joining Poppy Pie. Our team will review your application and contact you soon.</p>
                        <Button
                            onClick={() => setFormSubmitted(false)}
                            variant="outline"
                            className="border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                        >
                            Submit Another Application
                        </Button>
                    </motion.div>
                ) : (
                    <Form {...form}>
                        <motion.form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5"
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700">Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+91 XXXXX-XXXXX" type="tel" {...field} className="border-gray-300" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                                <FormField
                                    control={form.control}
                                    name="position"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700">Position</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={loading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="border-gray-300">
                                                        <SelectValue placeholder="Select a position" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {services.map((option) => (
                                                        <SelectItem key={option.id} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="experience"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700">Years of Experience</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. 2"
                                                    {...field}
                                                    className="border-gray-300"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="portfolio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 flex items-center">
                                                Portfolio URL (Optional)
                                                <TooltipProvider>
                                                    <Tooltip delayDuration={300}>
                                                        <TooltipTrigger asChild>
                                                            <button type="button" className="ml-1 focus:outline-none">
                                                                <Info className="h-3 w-3 text-gray-400 inline cursor-help" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="max-w-xs text-xs p-2 bg-gray-800 text-white">
                                                            <p>Include a link to your portfolio, LinkedIn, or other professional profile</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://yourportfolio.com"
                                                    type="url"
                                                    {...field}
                                                    className="border-gray-300"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="resume"
                                render={({ field: { value, onChange, ...field } }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Upload Resume/CV</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center">
                                                <Input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    className="hidden"
                                                    id="resume-upload"
                                                    onChange={(e) => handleFileChange(e, onChange)}
                                                    {...field}
                                                />
                                                <label
                                                    htmlFor="resume-upload"
                                                    className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                                >
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Choose File
                                                </label>
                                                <span className="ml-3 text-sm text-gray-500 truncate max-w-[200px]">
                                                    {fileName || "No file chosen"}
                                                </span>
                                            </div>
                                        </FormControl>
                                        <FormDescription className="text-xs text-gray-500">
                                            Upload your resume (PDF, DOC or DOCX, max 5MB)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="cover_letter"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Cover Letter</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe why you're interested in this position and how your experience makes you a good fit..."
                                                className="min-h-24 resize-y border-gray-300"
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
                                    {isSubmitting ? "Submitting..." : "Submit Application"}
                                </Button>
                            </div>
                        </motion.form>
                    </Form>
                )}
            </AnimatePresence>
        </>
    )
}

export default CareerForm;