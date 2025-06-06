"use client"

import { motion } from "framer-motion"
import {
    LifeBuoy,
    LightbulbIcon,
    Heart,
    Users,
    BarChart3,
    RefreshCw
} from "lucide-react"

const CareerValues = () => {
    // Values data
    const values = [
        {
            icon: <LightbulbIcon className="h-5 w-5 text-gray-900" />,
            title: "Innovation",
            description: "We embrace new ideas and technologies to stay ahead of the curve in the ever-evolving marketing landscape."
        },
        {
            icon: <Heart className="h-5 w-5 text-gray-900" />,
            title: "Passion",
            description: "We're passionate about creating exceptional marketing strategies that deliver meaningful results for our clients."
        },
        {
            icon: <Users className="h-5 w-5 text-gray-900" />,
            title: "Collaboration",
            description: "We believe in the power of teamwork and foster an environment where diverse perspectives are valued."
        },
        {
            icon: <BarChart3 className="h-5 w-5 text-gray-900" />,
            title: "Results-Driven",
            description: "We're committed to delivering measurable outcomes that help our clients achieve their business objectives."
        },
        {
            icon: <RefreshCw className="h-5 w-5 text-gray-900" />,
            title: "Adaptability",
            description: "We thrive in dynamic environments and quickly adjust our approach to meet changing market demands."
        }
    ]

    // Animation variants
    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    }

    return (
        <div>
            <div className="mb-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Our Values</h2>
                <p className="text-gray-600">The principles that guide our work and culture</p>
            </div>

            {/* Values cards - More compact layout */}
            <div className="space-y-4">
                {values.map((value, index) => (
                    <motion.div
                        key={index}
                        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                        variants={itemVariants}
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    >
                        <div className="flex items-start">
                            <div className="flex-shrink-0 bg-gray-100 p-2 rounded-full mr-3">
                                {value.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">{value.title}</h3>
                                <p className="text-gray-600 text-sm">{value.description}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Culture callout - More compact */}
            <motion.div
                className="mt-6 bg-gray-100 rounded-xl p-5"
                variants={itemVariants}
            >
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <LifeBuoy className="h-5 w-5 mr-2" />
                    Why Join Poppy Pie?
                </h3>
                <p className="text-gray-600 mb-3 text-sm">
                    At Poppy Pie, we&apos;re building more than just a marketing agency—we&apos;re creating a community of passionate marketers who are dedicated to helping businesses thrive.
                </p>
                <ul className="text-gray-600 space-y-1.5 text-sm">
                    <li className="flex items-start">
                        <span className="text-gray-900 mr-2">•</span>
                        <span>Opportunity to work with diverse clients across industries</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-gray-900 mr-2">•</span>
                        <span>Flexible work arrangements and work-life balance</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-gray-900 mr-2">•</span>
                        <span>Continuous learning and professional development</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-gray-900 mr-2">•</span>
                        <span>Competitive compensation and growth opportunities</span>
                    </li>
                </ul>
            </motion.div>
        </div>
    )
}

export default CareerValues