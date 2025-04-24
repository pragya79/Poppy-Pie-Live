"use client"

import { useState, useEffect } from "react"

// Custom hook to fetch and format services data
export const useServicesData = () => {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getServices = async () => {
            try {
                setLoading(true)
                // In a real app, this would be an API call
                // For now, we'll use hard-coded data based on the services page

                const servicesData = [
                    {
                        id: "service-1",
                        value: "Content Creation",
                        label: "Content Creation for Social Media Marketing"
                    },
                    {
                        id: "service-2",
                        value: "SEO Content Writing",
                        label: "SEO Content Writing Services"
                    },
                    {
                        id: "service-3",
                        value: "Sales & Marketing Automation",
                        label: "Sales & Marketing Automation Services"
                    },
                    {
                        id: "service-4",
                        value: "Market Research",
                        label: "Market Research Services"
                    },
                    {
                        id: "service-5",
                        value: "Social Media Management",
                        label: "Social Media Management Services"
                    },
                    {
                        id: "service-6",
                        value: "Offline Sales",
                        label: "Offline Sales Services"
                    },
                    {
                        id: "service-7",
                        value: "Social Media Ads",
                        label: "Social Media Ads"
                    }
                ]

                setServices(servicesData)
            } catch (err) {
                console.error("Error fetching services:", err)
                setError("Failed to load service options")
            } finally {
                setLoading(false)
            }
        }

        getServices()
    }, [])

    return { services, loading, error }
}