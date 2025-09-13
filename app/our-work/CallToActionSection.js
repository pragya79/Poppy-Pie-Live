import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles, Target, Users } from "lucide-react"

const CallToActionSection = () => {
    return (
        <motion.section
            className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
        >
            {/* Enhanced background effects */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                    animate={{
                        x: [-100, 100, -100],
                        y: [-50, 50, -50],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                    animate={{
                        x: [100, -100, 100],
                        y: [50, -50, 50],
                        scale: [1.2, 1, 1.2],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                {/* Enhanced animated icon */}
                <motion.div
                    className="mb-6 sm:mb-8"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6, type: "spring", stiffness: 200, damping: 20 }}
                >
                    <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl shadow-xl"
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </motion.div>
                </motion.div>

                {/* Enhanced headline */}
                <motion.h2
                    className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                >
                    Ready to Create Your
                    <motion.span
                        className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                        animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                        style={{
                            backgroundSize: "200% 200%",
                        }}
                    >
                        Success Story?
                    </motion.span>
                </motion.h2>

                {/* Enhanced description */}
                <motion.p
                    className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.8 }}
                >
                    Join the growing list of brands that have transformed their digital presence with
                    our creative expertise. Let&apos;s craft something extraordinary together.
                </motion.p>

                {/* Enhanced stats section */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.2, duration: 0.8 }}
                >
                    {[
                        { icon: Target, number: "200+", label: "Projects Delivered", color: "from-green-400 to-emerald-500" },
                        { icon: Users, number: "150+", label: "Happy Clients", color: "from-blue-400 to-cyan-500" },
                        { icon: Sparkles, number: "98%", label: "Success Rate", color: "from-purple-400 to-pink-500" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 2.4 + index * 0.1, duration: 0.6 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl mb-3 sm:mb-4`}>
                                <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>
                            <motion.div
                                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: index * 0.5,
                                }}
                            >
                                {stat.number}
                            </motion.div>
                            <div className="text-sm sm:text-base text-gray-400 font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Enhanced CTA buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.6, duration: 0.8 }}
                >
                    <Link href="/contact-us">
                        <motion.button
                            className="group relative px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 text-base sm:text-lg overflow-hidden"
                            whileHover={{
                                scale: 1.05,
                                y: -3,
                            }}
                            whileTap={{ scale: 0.95 }}
                            animate={{
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                            style={{
                                backgroundSize: "200% 200%",
                            }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    backgroundSize: "200% 200%",
                                }}
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                }}
                            />
                            <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                                Start Your Project
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </motion.div>
                            </span>
                        </motion.button>
                    </Link>

                    <Link href="/about-us">
                        <motion.button
                            className="group px-8 sm:px-10 py-4 sm:py-5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border-2 border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-white/40 text-base sm:text-lg"
                            whileHover={{
                                scale: 1.05,
                                y: -3,
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="flex items-center gap-2 sm:gap-3">
                                Learn More About Us
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{
                                        duration: 3,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "linear",
                                    }}
                                >
                                    <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                                </motion.div>
                            </span>
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Enhanced trust indicator */}
                <motion.p
                    className="mt-8 sm:mt-10 text-sm sm:text-base text-gray-400 flex items-center justify-center gap-2 flex-wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8, duration: 0.8 }}
                >
                    <span>🔒</span>
                    <span>Trusted by startups and Fortune 500 companies worldwide</span>
                </motion.p>
            </div>
        </motion.section>
    )
}

export default CallToActionSection
