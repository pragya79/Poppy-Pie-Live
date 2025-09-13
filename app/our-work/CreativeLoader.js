import { motion } from "framer-motion"

const CreativeLoader = () => {
    return (
        <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
            <div className="relative">
                {/* Main container */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24">
                    {/* Outer rotating ring */}
                    <motion.div
                        className="absolute inset-0 border-2 sm:border-3 lg:border-4 border-gray-200 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />

                    {/* Inner rotating ring */}
                    <motion.div
                        className="absolute inset-1 sm:inset-2 border-2 sm:border-3 lg:border-4 border-transparent border-t-black rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />

                    {/* Center pulsing dot */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: 1.2 }}
                        transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            ease: "easeInOut",
                        }}
                    >
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-black rounded-full" />
                    </motion.div>

                    {/* Floating particles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"
                            style={{
                                top: "50%",
                                left: "50%",
                                transformOrigin: "0 0",
                            }}
                            animate={{
                                rotate: 360,
                                scale: 1,
                                opacity: 1,
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.3,
                                ease: "linear",
                            }}
                            initial={{
                                x: Math.cos((i * 60 * Math.PI) / 180) * (typeof window !== 'undefined' && window.innerWidth < 640 ? 25 : typeof window !== 'undefined' && window.innerWidth < 1024 ? 35 : 40),
                                y: Math.sin((i * 60 * Math.PI) / 180) * (typeof window !== 'undefined' && window.innerWidth < 640 ? 25 : typeof window !== 'undefined' && window.innerWidth < 1024 ? 35 : 40),
                            }}
                        />
                    ))}
                </div>

                {/* Loading text */}
                <motion.div
                    className="mt-4 sm:mt-6 text-center"
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                >
                    <p className="text-gray-600 font-medium text-sm sm:text-base">Loading brand stories...</p>
                    <div className="flex justify-center mt-2 space-x-1">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"
                                animate={{ y: -6 }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default CreativeLoader
