"use client"

import { motion } from "framer-motion"

// Animation variants
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

const ContactInfoCard = ({ info }) => {
    return (
        <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6 transition-shadow hover:shadow-md"
        >
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-full bg-blue-50 p-3">
                    {info.icon}
                </div>
                <div>
                    <h3 className="text-gray-800 font-medium mb-1">{info.title}</h3>
                    <p className="text-gray-800 text-lg font-semibold mb-1">{info.info}</p>
                    <div className="flex items-center text-sm text-gray-500">
                        {info.subIcon && <span className="mr-1">{info.subIcon}</span>}
                        <span>{info.subInfo}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default ContactInfoCard