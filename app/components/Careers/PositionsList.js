"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Briefcase, Clock, MapPin, DollarSign, ArrowRight, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

const PositionsList = () => {
    const [positions, setPositions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            const response = await fetch('/api/jobs?status=published')
            if (!response.ok) {
                throw new Error('Failed to fetch jobs')
            }
            const data = await response.json()

            // Filter jobs that are still accepting applications
            const currentDate = new Date()
            const availableJobs = (data.jobs || []).filter(job => {
                // Include jobs with no deadline or deadline in the future
                return !job.applicationDeadline || new Date(job.applicationDeadline) > currentDate
            })

            setPositions(availableJobs)
            setError(null)
        } catch (error) {
            console.error('Error fetching jobs:', error)
            setError(error.message)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    // Extract unique categories for filter
    const categories = ["all", ...new Set(positions.map(position => position.category).filter(Boolean))]

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
                <div className="flex items-center justify-center gap-4 mb-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Open Positions</h2>
                    <Button
                        onClick={() => fetchJobs(true)}
                        variant="outline"
                        size="sm"
                        disabled={refreshing}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Join our team of marketing experts and help businesses achieve their growth objectives through innovative strategies
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading positions...</span>
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <div className="text-red-500 mb-4">Error loading positions: {error}</div>
                    <Button onClick={() => fetchJobs()} variant="outline">
                        Try Again
                    </Button>
                </div>
            ) : (
                <>
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
                                <motion.div key={position._id} variants={itemVariants}>
                                    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300">
                                        <CardHeader className="pb-2">
                                            <div className="text-sm font-medium text-gray-500 mb-1">{position.category}</div>
                                            <CardTitle className="text-xl">{position.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <CardDescription className="text-gray-600 mb-4">
                                                {position.content ? position.content.substring(0, 150) + '...' : 'No description available'}
                                            </CardDescription>
                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                                    <span>{position.location || 'Remote'}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                                    <span>{position.employmentType || 'Full-time'}</span>
                                                </div>
                                                {position.salaryRange && (
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                                                        <span>{position.salaryRange}</span>
                                                    </div>
                                                )}
                                                {position.applicationDeadline && (
                                                    <div className="flex items-center text-sm text-orange-600">
                                                        <Clock className="h-4 w-4 mr-2 text-orange-500" />
                                                        <span>Apply by {new Date(position.applicationDeadline).toLocaleDateString()}</span>
                                                    </div>
                                                )}
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
                                                        // Pre-fill the position in the form
                                                        setTimeout(() => {
                                                            const positionSelect = document.querySelector('select[name="position"]');
                                                            if (positionSelect) {
                                                                // Create option if it doesn't exist
                                                                const existingOption = Array.from(positionSelect.options)
                                                                    .find(option => option.value === position.title);
                                                                if (!existingOption) {
                                                                    const newOption = document.createElement('option');
                                                                    newOption.value = position.title;
                                                                    newOption.textContent = position.title;
                                                                    positionSelect.appendChild(newOption);
                                                                }
                                                                positionSelect.value = position.title;
                                                                positionSelect.dispatchEvent(new Event('change'));
                                                            }
                                                        }, 100);
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
                            <div className="col-span-full text-center py-12">
                                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Open Positions</h3>
                                <p className="text-gray-500 mb-4">
                                    {selectedCategory === "all"
                                        ? "We don't have any open positions at the moment. Check back soon!"
                                        : `No positions available in ${selectedCategory} category.`
                                    }
                                </p>
                                <p className="text-sm text-gray-400">
                                    You can still submit a general application below and we&apos;ll keep your information on file.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </div>
    )
}

export default PositionsList