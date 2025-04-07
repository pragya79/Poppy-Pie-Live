"use client"

import { useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Activity,
    Mail,
    FileText,
    TrendingUp,
    Users,
    ArrowUpRight
} from "lucide-react"
import { useAuth } from "@/app/components/context/AuthProvider"
import { useRouter } from "next/navigation"

// Stats cards data for dashboard
const statsCards = [
    {
        title: "Total Inquiries",
        value: "145",
        change: "+12.5%",
        trend: "up",
        description: "vs. previous month",
        icon: <Mail className="h-5 w-5 text-blue-500" />
    },
    {
        title: "Blog Posts",
        value: "28",
        change: "+3.2%",
        trend: "up",
        description: "vs. previous month",
        icon: <FileText className="h-5 w-5 text-indigo-500" />
    },
    {
        title: "Visitor Traffic",
        value: "8,642",
        change: "+18.7%",
        trend: "up",
        description: "vs. previous month",
        icon: <TrendingUp className="h-5 w-5 text-green-500" />
    },
    {
        title: "Conversion Rate",
        value: "4.6%",
        change: "+1.2%",
        trend: "up",
        description: "vs. previous month",
        icon: <Users className="h-5 w-5 text-purple-500" />
    }
]

// Recent inquiries data
const recentInquiries = [
    {
        id: "INQ-001",
        name: "John Smith",
        email: "john@example.com",
        date: "2025-04-02",
        subject: "Branding services inquiry",
        status: "new"
    },
    {
        id: "INQ-002",
        name: "Emily Johnson",
        email: "emily@company.co",
        date: "2025-04-01",
        subject: "Digital marketing strategy",
        status: "new"
    },
    {
        id: "INQ-003",
        name: "Michael Brown",
        email: "michael@startup.io",
        date: "2025-03-31",
        subject: "Website redesign project",
        status: "in-progress"
    },
    {
        id: "INQ-004",
        name: "Sarah Williams",
        email: "sarah@corporation.com",
        date: "2025-03-30",
        subject: "Social media management",
        status: "in-progress"
    },
    {
        id: "INQ-005",
        name: "David Lee",
        email: "david@business.org",
        date: "2025-03-28",
        subject: "Logo design inquiry",
        status: "completed"
    }
]

// Recent blog posts data
const recentBlogPosts = [
    {
        id: "POST-001",
        title: "Digital Marketing Trends for 2025",
        date: "2025-04-01",
        author: "Admin",
        views: 428,
        status: "published"
    },
    {
        id: "POST-002",
        title: "How to Build a Strong Brand Identity",
        date: "2025-03-28",
        author: "Admin",
        views: 356,
        status: "published"
    },
    {
        id: "POST-003",
        title: "The Power of Content Marketing",
        date: "2025-03-25",
        author: "Admin",
        views: 279,
        status: "published"
    }
]

export default function AdminDashboard() {
    const { user, isAuthenticated, loading } = useAuth()
    // const router = useRouter()

    // Redirect if not authenticated
    // useEffect(() => {
    //     if (!loading && !isAuthenticated) {
    //         router.push('/login')
    //     }
    // }, [isAuthenticated, loading, router])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back to the admin dashboard</p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((card, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {card.title}
                            </CardTitle>
                            <div className="h-8 w-8 rounded-full bg-gray-100 p-1.5 flex items-center justify-center">
                                {card.icon}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">{card.value}</div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className={card.trend === "up" ? "text-green-500" : "text-red-500"}>
                                    {card.change}
                                </span>
                                <ArrowUpRight className={`h-3 w-3 ${card.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                                <span className="text-gray-500 ml-1">{card.description}</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity Row - Inquiries and Blog Posts */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Inquiries Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Inquiries</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <CardDescription>Latest customer inquiries received</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentInquiries.slice(0, 4).map((inquiry) => (
                                <div key={inquiry.id} className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium text-sm">{inquiry.name}</p>
                                        <p className="text-xs text-gray-500">{inquiry.subject}</p>
                                        <p className="text-xs text-gray-500">{new Date(inquiry.date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                                    inquiry.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'}`}
                                        >
                                            {inquiry.status === 'new' ? 'New' :
                                                inquiry.status === 'in-progress' ? 'In Progress' :
                                                    'Completed'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 mt-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                            onClick={() => router.push('/admin/inquiries')}
                        >
                            View All Inquiries
                        </button>
                    </CardContent>
                </Card>

                {/* Recent Blog Posts Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Blog Posts</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <CardDescription>Latest published blog content</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentBlogPosts.map((post) => (
                                <div key={post.id} className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium text-sm">{post.title}</p>
                                        <p className="text-xs text-gray-500">By {post.author}</p>
                                        <p className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                            Published
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">{post.views} views</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 mt-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                            onClick={() => router.push('/admin/blog')}
                        >
                            Manage Blog Posts
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}