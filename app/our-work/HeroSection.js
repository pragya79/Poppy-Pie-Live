import { motion } from "framer-motion"
import Image from "next/image"
import { ThreeDMarquee } from "@/components/ui/3d-marquee"

const HeroSection = ({ featuredProjectImages = [] }) => {
    return (
        <>
            {/* Featured Projects Marquee */}
            <section className="py-16">
                <h2 className="text-4xl font-bold text-center mb-12">Featured Projects</h2>
                <ThreeDMarquee
                    images={featuredProjectImages}
                    className="h-[600px] mx-auto"
                />
            </section>

            {/* Hero Section with Background Image */}
            <motion.section
                className="relative h-[40vh] sm:h-[45vh] md:h-[52vh] w-[90%] sm:w-4/5 max-w-6xl mx-auto overflow-hidden rounded-2xl sm:rounded-3xl my-4 sm:my-6 lg:my-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Creative workspace"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1200px"
                    />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-pink-900/60 to-orange-900/70"></div>

                {/* Hero Content */}
                <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
                    <div className="text-center">
                        <motion.h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                            style={{
                                textShadow: "0 8px 32px rgba(0,0,0,0.5)",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            our work
                        </motion.h1>
                    </div>
                </div>
            </motion.section>
        </>
    )
}

export default HeroSection
