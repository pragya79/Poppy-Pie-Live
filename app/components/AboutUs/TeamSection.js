"use client"

import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"

// TeamMember Card component that uses the focus card approach
const TeamMemberCard = React.memo(({
    member,
    index,
    hovered,
    setHovered,
    setActiveTeamMember,
    activeTeamMember,
    Variants
}) => (
    <motion.div
        className={cn(
            "rounded-xl relative overflow-hidden cursor-pointer transition-all duration-300 ease-out",
            "h-64 sm:h-72 md:h-80 w-full",
            hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
        )}
        onClick={() => setActiveTeamMember(activeTeamMember === member.id ? null : member.id)}
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
        variants={Variants}
    >
        <div className="relative h-full w-full">
            <Image
                src={member.image}
                alt={member.name}
                fill
                className={cn(
                    "object-cover transition-all duration-500",
                    hovered === index ? "grayscale-0" : "grayscale"
                )}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                data-placeholder={`team-member-${member.id}`}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70"></div>

            {/* Content overlay - visible on hover */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/40 flex flex-col justify-end p-6 transition-opacity duration-300",
                    hovered === index ? "opacity-100" : "opacity-0"
                )}
            >
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-gray-200">{member.role}</p>
            </div>

            {/* Always visible text info at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-gray-200">{member.role}</p>
            </div>
        </div>
    </motion.div>
));

TeamMemberCard.displayName = "TeamMemberCard";

const TeamSection = () => {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
    const [activeTeamMember, setActiveTeamMember] = useState(null)
    const [hovered, setHovered] = useState(null)

    // Team members data
    const teamMembers = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Founder & CEO",
            bio: "Sarah founded Poppy Pie with a vision to transform how businesses approach marketing. With over 15 years of experience in digital marketing and brand strategy, she's led campaigns for Fortune 500 companies and emerging startups alike. Sarah is passionate about combining data-driven insights with creative storytelling to deliver exceptional results.",
            image: "/logo.png",
            social: {
                linkedin: "#",
                twitter: "#"
            }
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Creative Director",
            bio: "Michael leads our creative team with a keen eye for design and a talent for developing unique brand identities. His background in both traditional and digital design allows him to create cohesive visual experiences across all channels. Previously, Michael worked with renowned agencies in New York and London, bringing global perspective to our creative approach.",
            image: "/logo.png",
            social: {
                linkedin: "#",
                twitter: "#"
            }
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            role: "Head of Strategy",
            bio: "Emily oversees all strategic initiatives at Poppy Pie, ensuring our solutions align with client objectives and market opportunities. With a background in business consulting and digital transformation, she specializes in helping brands navigate complex challenges and capitalize on emerging trends. Emily holds an MBA from Stanford and regularly speaks at industry conferences.",
            image: "/logo.png",
            social: {
                linkedin: "#",
                twitter: "#"
            }
        },
        {
            id: 4,
            name: "David Williams",
            role: "Technical Director",
            bio: "David brings technical expertise to our marketing solutions, bridging the gap between creative concepts and technical execution. He leads our development team in creating cutting-edge websites, applications, and AI-powered marketing tools. With a background in software engineering and digital architecture, David ensures our technical solutions are robust, scalable, and innovative.",
            image: "/logo.png",
            social: {
                linkedin: "#",
                twitter: "#"
            }
        },
        {
            id: 5,
            name: "Aisha Patel",
            role: "Client Success Manager",
            bio: "Aisha ensures our clients receive exceptional service from strategy development through implementation. She acts as the primary liaison between our internal teams and clients, managing expectations and facilitating clear communication. Her background in customer experience and project management enables her to anticipate client needs and ensure smooth project delivery.",
            image: "/logo.png",
            social: {
                linkedin: "#",
                twitter: "#"
            }
        },
        {
            id: 6,
            name: "James Wilson",
            role: "Analytics Director",
            bio: "James leads our data and analytics practice, transforming complex data into actionable insights. His expertise in marketing analytics, attribution modeling, and performance measurement helps clients understand the impact of their marketing initiatives and identify opportunities for optimization. James previously worked at leading tech companies and holds a Ph.D. in Statistics.",
            image: "/logo.png",
            social: {
                linkedin: "#",
                twitter: "#"
            }
        }
    ]

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
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

    const profileVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    }

    const bioVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    }

    // Bio section for selected team member
    const SelectedBio = ({ memberId }) => {
        if (!memberId) return null;

        const member = teamMembers.find(m => m.id === memberId);
        if (!member) return null;

        return (
            <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={bioVariants}
                className="bg-white shadow-lg rounded-xl p-6 sm:p-8 mb-10 max-w-3xl mx-auto"
            >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="sm:w-1/4">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-md mx-auto">
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                                sizes="96px"
                            />
                        </div>
                    </div>
                    <div className="sm:w-3/4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                        <p className="text-gray-600 mb-1">{member.role}</p>
                        <p className="text-gray-700 mt-3">{member.bio}</p>

                        <div className="flex space-x-3 mt-4">
                            <a
                                href={member.social.linkedin}
                                className="p-2 rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
                                aria-label={`LinkedIn profile of ${member.name}`}
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                            <a
                                href={member.social.twitter}
                                className="p-2 rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
                                aria-label={`Twitter profile of ${member.name}`}
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <section className="py-16 sm:py-20 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6">
                <motion.div
                    ref={sectionRef}
                    className="max-w-screen-xl mx-auto"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                >
                    <motion.div className="text-center mb-12 sm:mb-16" variants={itemVariants}>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Meet Our Team
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                            Our diverse team of experts brings together creativity, strategy, and technical expertise to deliver exceptional results.
                        </p>
                    </motion.div>

                    {/* Bio section */}
                    {activeTeamMember && <SelectedBio memberId={activeTeamMember} />}

                    {/* Team members grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {teamMembers.map((member, index) => (
                            <TeamMemberCard
                                key={member.id}
                                member={member}
                                index={index}
                                hovered={hovered}
                                setHovered={setHovered}
                                setActiveTeamMember={setActiveTeamMember}
                                activeTeamMember={activeTeamMember}
                                Variants={profileVariants}
                            />
                        ))}
                    </div>

                    <motion.div
                        className="mt-12 sm:mt-16 text-center"
                        variants={itemVariants}
                    >
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Our team is constantly growing! We&apos;re always looking for talented individuals who are passionate about marketing, design, and technology.
                        </p>
                        <a
                            href="/careers"
                            className="inline-block mt-4 text-gray-900 font-medium hover:text-black"
                        >
                            View Career Opportunities →
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default TeamSection