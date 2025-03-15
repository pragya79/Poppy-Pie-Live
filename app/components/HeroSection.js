'use client'
import React from 'react'
import AnimatedTestimonials from './Testimonial/AnimatedTestimonials'
import testimonials from './Testimonial/TestimonialUtility'

const HeroSection = () => {
    return (
        <section className="relative min-h-screen w-full py-24 md:py-32 px-4 md:px-8 lg:px-16 overflow-hidden flex items-center">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-20 lg:gap-24">
                {/* Text content column */}
                <div className="w-full lg:w-5/12 text-center lg:text-left mb-16 lg:mb-0 z-10 lg:pt-12 lg:pr-8">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                        Not just another brand building legacy
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
                        Our mission is to create a better future for our customers, employees, and communities
                    </p>
                </div>

                {/* Testimonials column */}
                <div className="w-full lg:w-7/12 flex justify-center lg:justify-end lg:pl-8">
                    <AnimatedTestimonials testimonials={testimonials} />
                </div>
            </div>

            {/* Background elements for visual interest */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-blue-50 opacity-50 blur-xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gray-100 opacity-40 blur-xl"></div>
                <div className="absolute top-2/3 left-1/3 w-72 h-72 rounded-full bg-indigo-50 opacity-30 blur-xl"></div>
            </div>
        </section>
    )
}

export default HeroSection;