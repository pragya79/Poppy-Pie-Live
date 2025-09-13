"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    BarChart, Users, Globe, TrendingUp, FileText,
    MessageSquare, Briefcase, UserCheck, Clock,
    CheckCircle, AlertCircle, Eye, Calendar
} from "lucide-react"

export default function Analytics() {
    const [analytics, setAnalytics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('/api/analytics')
            if (!response.ok) {
                throw new Error('Failed to fetch analytics')
            }
            const data = await response.json()
            setAnalytics(data)
        } catch (error) {
            console.error('Error fetching analytics:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading analytics</h3>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={fetchAnalytics}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    const { overview, detailedStats, recentActivities, popularServices } = analytics

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                <p className="text-gray-600">Track your website performance and user engagement</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview.totalBlogs}</div>
                        <p className="text-xs text-muted-foreground">
                            {overview.publishedBlogs} published, {overview.draftBlogs} drafts
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview.totalInquiries}</div>
                        <p className="text-xs text-muted-foreground">
                            {overview.pendingInquiries} pending responses
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview.activeJobs}</div>
                        <p className="text-xs text-muted-foreground">
                            {overview.totalApplications} total applications
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            {overview.recentUsers} new this week
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
                    <TabsTrigger value="jobs">Jobs & Applications</TabsTrigger>
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Content Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Published Blogs
                                        </span>
                                        <span className="font-semibold">{detailedStats.blogs.published}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Draft Blogs
                                        </span>
                                        <span className="font-semibold">{detailedStats.blogs.draft}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4" />
                                            Recent Blogs (7d)
                                        </span>
                                        <span className="font-semibold">{detailedStats.blogs.recent}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Popular Services</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {popularServices.map((service, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="capitalize">{service._id}</span>
                                            <span className="font-semibold">{service.count} inquiries</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="inquiries" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                                <Clock className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">
                                    {detailedStats.inquiries.pending}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                                <Eye className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                    {detailedStats.inquiries.inProgress}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {detailedStats.inquiries.resolved}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="jobs" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4" />
                                            Total Jobs
                                        </span>
                                        <span className="font-semibold">{detailedStats.jobs.total}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            Active Jobs
                                        </span>
                                        <span className="font-semibold text-green-600">{detailedStats.jobs.active}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-gray-500" />
                                            Closed Jobs
                                        </span>
                                        <span className="font-semibold text-gray-600">{detailedStats.jobs.closed}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Application Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-orange-500" />
                                            Pending
                                        </span>
                                        <span className="font-semibold text-orange-600">
                                            {detailedStats.applications.pending}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-2">
                                            <UserCheck className="h-4 w-4 text-blue-500" />
                                            Shortlisted
                                        </span>
                                        <span className="font-semibold text-blue-600">
                                            {detailedStats.applications.shortlisted}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            Reviewed
                                        </span>
                                        <span className="font-semibold text-green-600">
                                            {detailedStats.applications.reviewed}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((activity, index) => (
                                        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-shrink-0">
                                                {activity.type === 'blog' && <FileText className="h-5 w-5 text-blue-500" />}
                                                {activity.type === 'inquiry' && <MessageSquare className="h-5 w-5 text-green-500" />}
                                                {activity.type === 'application' && <Briefcase className="h-5 w-5 text-purple-500" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {activity.title}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(activity.date).toLocaleDateString()} at{' '}
                                                    {new Date(activity.date).toLocaleTimeString()}
                                                </p>
                                                {activity.service && (
                                                    <p className="text-xs text-gray-400">Service: {activity.service}</p>
                                                )}
                                                {activity.job && (
                                                    <p className="text-xs text-gray-400">Job: {activity.job}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
