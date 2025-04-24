"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Briefcase, Clock, MapPin, DollarSign, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { useServicesData } from "./useServiceData"

const PositionsList = () => {
    const { services } = useServicesData()
    const [selectedCategory, setSelectedCategory] = useState("all")

    // Sample positions data - in a real app this would come from an API
    const positions = [
        {
            id: 1,
            title: "Content Creator",
            category: "Content Creation",
            location: "Remote",
            type: "Full-time",
            salary: "$30K - $45K",
            description: "Create engaging content across various platforms, develop social media strategies, and help brands tell their story effectively."
        },
        {
            id: 2,
            title: "SEO Content Writer",
            category: "SEO Content Writing",
            location: "Remote / Mohali",
            type: "Full-time",
            salary: "$25K - $40K",
            description: "Write SEO-optimized content for websites and blogs, conduct keyword research, and enhance existing content for better search performance."
        },
        {
            id: 3,
            title: "Marketing Automation Specialist",
            category: "Sales & Marketing Automation",
            location: "Mohali",
            type: "Full-time",
            salary: "$40K - $55K",
            description: "Set up and manage automated marketing workflows, implement lead generation strategies, and optimize customer engagement journeys."
        },
        {
            id: 4,
            title: "Market Researcher",
            category: "Market Research",
            location: "Remote / Mohali",
            type: "Part-time",
            salary: "$20K - $35K",
            description: "Conduct market analysis, gather competitive intelligence, and provide insights to inform marketing strategies."
        },
        {
            id: 5,
            title: "Social Media Manager",
            category: "Social Media Management",
            location: "Remote",
            type: "Full-time",
            salary: "$30K - $45K",
            description: "Manage social media accounts, create content calendars, and develop strategies to grow engagement and reach."
        },
        {
            id: 6,
            title: "Sales Representative",
            category: "Offline Sales",
            location: "Mohali",
            type: "Full-time",
            salary: "$25K - $50K + Commission",
            description: "Generate leads, build client relationships, and represent our brand with confidence and expertise in face-to-face settings."
        },
        {
            id: 7,
            title: "Paid Ads Specialist",
            category: "Social Media Ads",
            location: "Remote / Mohali",
            type: "Full-time",
            salary: "$35K - $50K",
            description: "Create and optimize ad campaigns across social media platforms, manage budgets, and maximize ROI."
        }
    ]

    // Extract unique categories for filter
    const categories = ["all", ...new Set(positions.map(position => position.category))]

    // Filter positions based on selected category
    const filteredPositions = selectedCategory === "all"
        ? positions
        : positions.filter(position => position.category === selectedCategory)

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
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
        <div id="open-positions">
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Join our team of marketing experts and help businesses achieve their growth objectives through innovative strategies
                </p>
            </div>

            {/* Category filter */}
            <div className="mb-8 overflow-x-auto pb-2">
                <div className="flex space-x-2 min-w-max">
                    {categories.map((category, index) => (
                        <Button
                            key={index}
                            variant={selectedCategory === category ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className="whitespace-nowrap"
                        >
                            {category === "all" ? "All Positions" : category}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Positions grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {filteredPositions.length > 0 ? (
                    filteredPositions.map((position) => (
                        <motion.div key={position.id} variants={itemVariants}>
                            <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300">
                                <CardHeader className="pb-2">
                                    <div className="text-sm font-medium text-gray-500 mb-1">{position.category}</div>
                                    <CardTitle className="text-xl">{position.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <CardDescription className="text-gray-600 mb-4">
                                        {position.description}
                                    </CardDescription>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                            <span>{position.location}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                            <span>{position.type}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                                            <span>{position.salary}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2 flex justify-end">
                                    <Button
                                        variant="ghost"
                                        className="flex items-center text-gray-900 hover:text-gray-700 hover:bg-gray-100 group"
                                        onClick={() => {
                                            const element = document.getElementById('application-form');
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth' });
                                                // Optionally pre-fill the position in the form
                                                const positionSelect = document.getElementById('position');
                                                if (positionSelect) {
                                                    positionSelect.value = position.category;
                                                }
                                            }
                                        }}
                                    >
                                        Apply Now
                                        <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-8">
                        <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No positions available in this category</p>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default PositionsList