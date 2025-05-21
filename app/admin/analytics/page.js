"use client"

import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    BarChart,
    Calendar,
    Download,
    Filter,
    MailOpen,
    Users,
    Globe,
    Clock,
    TrendingUp,
    Layers,
    FileText,
    RefreshCw
} from "lucide-react"

// Sample data structure for analytics API
const analyticsApiUrl = "/api/analytics" // This would be your real API endpoint

const Analytics = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [analytics, setAnalytics] = useState(null)
    const [timeRange, setTimeRange] = useState("7d")
    const [activeTab, setActiveTab] = useState("overview")

    // Fetch analytics data
    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true)
            try {
                // Simulate API fetch - replace with real API call
                await new Promise(resolve => setTimeout(resolve, 600))

                // This is placeholder data. In production, you would fetch real data:
                // const response = await fetch(`${analyticsApiUrl}?timeRange=${timeRange}`)
                // const data = await response.json()

                // Sample structure that would be returned by API
                const data = {
                    overview: {
                        visitors: {
                            count: 8642,
                            change: 18.7,
                            trend: "up"
                        },
                        inquiries: {
                            count: 145,
                            change: 12.5,
                            trend: "up"
                        },
                        blogViews: {
                            count: 3256,
                            change: 8.3,
                            trend: "up"
                        },
                        conversionRate: {
                            rate: 4.6,
                            change: 1.2,
                            trend: "up"
                        }
                    },
                    traffic: {
                        sources: [
                            { source: "Direct", count: 2315, percentage: 26.8 },
                            { source: "Organic Search", count: 3246, percentage: 37.6 },
                            { source: "Social Media", count: 1528, percentage: 17.7 },
                            { source: "Referral", count: 914, percentage: 10.6 },
                            { source: "Email", count: 639, percentage: 7.3 }
                        ],
                        devices: [
                            { device: "Desktop", percentage: 48.2 },
                            { device: "Mobile", percentage: 42.7 },
                            { device: "Tablet", percentage: 9.1 }
                        ],
                        topPages: [
                            { page: "/", title: "Home", views: 3245 },
                            { page: "/services", title: "Services", views: 1542 },
                            { page: "/blog", title: "Blog", views: 1258 },
                            { page: "/contact", title: "Contact", views: 968 },
                            { page: "/about", title: "About", views: 893 }
                        ]
                    },
                    content: {
                        topPosts: [
                            { id: "POST-001", title: "Digital Marketing Trends for 2025", views: 428, engagement: 8.7 },
                            { id: "POST-002", title: "How to Build a Strong Brand Identity", views: 356, engagement: 7.2 },
                            { id: "POST-003", title: "The Power of Content Marketing", views: 279, engagement: 6.4 },
                            { id: "POST-004", title: "Social Media Strategies for Small Businesses", views: 254, engagement: 5.9 },
                            { id: "POST-005", title: "Web Design Tips for Better Conversion", views: 183, engagement: 4.6 }
                        ],
                        contentPerformance: {
                            totalViews: 3256,
                            avgEngagement: 6.3,
                            avgTimeOnPage: "2:45"
                        }
                    },
                    inquiries: {
                        monthly: [
                            { month: "Jan", count: 78 },
                            { month: "Feb", count: 92 },
                            { month: "Mar", count: 115 },
                            { month: "Apr", count: 145 }
                        ],
                        byCategory: [
                            { category: "Branding", count: 42, percentage: 29 },
                            { category: "Web Design", count: 38, percentage: 26.2 },
                            { category: "Digital Marketing", count: 35, percentage: 24.1 },
                            { category: "Social Media", count: 21, percentage: 14.5 },
                            { category: "Other", count: 9, percentage: 6.2 }
                        ],
                        conversionTimes: {
                            avgResponseTime: "4.2h",
                            avgResolutionTime: "2.3d",
                            conversionRate: "28%"
                        }
                    }
                }

                setAnalytics(data)
            } catch (error) {
                console.error("Failed to fetch analytics:", error)
                // Handle error state
            } finally {
                setIsLoading(false)
            }
        }

        fetchAnalytics()
    }, [timeRange])

    // Format percentage change with + or - sign
    const formatChange = (value) => {
        return value >= 0 ? `+${value}%` : `${value}%`
    }

    // Handle refresh button click
    const handleRefresh = () => {
        setIsLoading(true)
        // Re-fetch data with the current time range
        setTimeout(() => {
            setIsLoading(false)
        }, 800)
    }

    // Handle export data click
    const handleExport = () => {
        // Implement export functionality (CSV, PDF, etc.)
        console.log("Exporting analytics data...")
        // In a real implementation, you would generate and download a file
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full py-20">
                <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">View and analyze your website performance</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={handleRefresh}
                        disabled={isLoading}
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={handleExport}
                    >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <Select
                                    value={timeRange}
                                    onValueChange={setTimeRange}
                                >
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Time period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7d">Last 7 days</SelectItem>
                                        <SelectItem value="30d">Last 30 days</SelectItem>
                                        <SelectItem value="90d">Last 90 days</SelectItem>
                                        <SelectItem value="year">Last year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Analytics Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <BarChart className="h-4 w-4" />
                        <span>Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="traffic" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Traffic</span>
                    </TabsTrigger>
                    <TabsTrigger value="content" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Content</span>
                    </TabsTrigger>
                    <TabsTrigger value="inquiries" className="flex items-center gap-2">
                        <MailOpen className="h-4 w-4" />
                        <span>Inquiries</span>
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Visitors Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Visitors
                                </CardTitle>
                                <div className="h-8 w-8 rounded-full bg-gray-100 p-1.5 flex items-center justify-center">
                                    <Users className="h-4 w-4 text-blue-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold">{analytics.overview.visitors.count.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span className={analytics.overview.visitors.trend === "up" ? "text-green-500" : "text-red-500"}>
                                        {formatChange(analytics.overview.visitors.change)}
                                    </span>
                                    <TrendingUp className={`h-3 w-3 ${analytics.overview.visitors.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                                    <span className="text-gray-500 ml-1">vs. previous period</span>
                                </p>
                            </CardContent>
                        </Card>

                        {/* Inquiries Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Inquiries
                                </CardTitle>
                                <div className="h-8 w-8 rounded-full bg-gray-100 p-1.5 flex items-center justify-center">
                                    <MailOpen className="h-4 w-4 text-indigo-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold">{analytics.overview.inquiries.count}</div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span className={analytics.overview.inquiries.trend === "up" ? "text-green-500" : "text-red-500"}>
                                        {formatChange(analytics.overview.inquiries.change)}
                                    </span>
                                    <TrendingUp className={`h-3 w-3 ${analytics.overview.inquiries.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                                    <span className="text-gray-500 ml-1">vs. previous period</span>
                                </p>
                            </CardContent>
                        </Card>

                        {/* Blog Views Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Blog Views
                                </CardTitle>
                                <div className="h-8 w-8 rounded-full bg-gray-100 p-1.5 flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-green-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold">{analytics.overview.blogViews.count.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span className={analytics.overview.blogViews.trend === "up" ? "text-green-500" : "text-red-500"}>
                                        {formatChange(analytics.overview.blogViews.change)}
                                    </span>
                                    <TrendingUp className={`h-3 w-3 ${analytics.overview.blogViews.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                                    <span className="text-gray-500 ml-1">vs. previous period</span>
                                </p>
                            </CardContent>
                        </Card>

                        {/* Conversion Rate Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Conversion Rate
                                </CardTitle>
                                <div className="h-8 w-8 rounded-full bg-gray-100 p-1.5 flex items-center justify-center">
                                    <TrendingUp className="h-4 w-4 text-purple-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold">{analytics.overview.conversionRate.rate}%</div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span className={analytics.overview.conversionRate.trend === "up" ? "text-green-500" : "text-red-500"}>
                                        {formatChange(analytics.overview.conversionRate.change)}
                                    </span>
                                    <TrendingUp className={`h-3 w-3 ${analytics.overview.conversionRate.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                                    <span className="text-gray-500 ml-1">vs. previous period</span>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Traffic Tab */}
                <TabsContent value="traffic" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Traffic Sources Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Traffic Sources</CardTitle>
                                <CardDescription>Where your visitors are coming from</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.traffic.sources.map((source) => (
                                        <div key={source.source} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                <span className="text-sm font-medium">{source.source}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-gray-500">{source.count.toLocaleString()}</span>
                                                <div className="min-w-12 text-right">
                                                    <span className="text-sm font-medium">{source.percentage}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Pages Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Pages</CardTitle>
                                <CardDescription>Most viewed pages on your website</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.traffic.topPages.map((page) => (
                                        <div key={page.page} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 truncate max-w-[70%]">
                                                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                                <span className="text-sm font-medium truncate" title={page.title}>
                                                    {page.title}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-medium">{page.views.toLocaleString()} views</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Devices Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Device Breakdown</CardTitle>
                                <CardDescription>Visitors by device type</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.traffic.devices.map((device) => (
                                        <div key={device.device} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${device.device === "Desktop" ? "bg-blue-500" :
                                                        device.device === "Mobile" ? "bg-green-500" : "bg-purple-500"
                                                    }`}></div>
                                                <span className="text-sm font-medium">{device.device}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${device.device === "Desktop" ? "bg-blue-500" :
                                                                device.device === "Mobile" ? "bg-green-500" : "bg-purple-500"
                                                            }`}
                                                        style={{ width: `${device.percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="min-w-12 text-right">
                                                    <span className="text-sm font-medium">{device.percentage}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Top Posts Card */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Top Performing Blog Posts</CardTitle>
                                <CardDescription>Most viewed and engaging content</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Post</th>
                                                <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Views</th>
                                                <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">Engagement</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analytics.content.topPosts.map((post) => (
                                                <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-sm font-medium">{post.title}</td>
                                                    <td className="py-3 px-4 text-sm">{post.views.toLocaleString()}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-blue-500 rounded-full"
                                                                    style={{ width: `${(post.engagement / 10) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm">{post.engagement}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Content Performance Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Content Performance</CardTitle>
                                <CardDescription>Key content metrics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-500">Total Blog Views</span>
                                            <span className="font-medium">{analytics.content.contentPerformance.totalViews.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-500">Average Engagement Score</span>
                                            <span className="font-medium">{analytics.content.contentPerformance.avgEngagement} / 10</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${(analytics.content.contentPerformance.avgEngagement / 10) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-500">Average Time on Page</span>
                                            <span className="font-medium">{analytics.content.contentPerformance.avgTimeOnPage}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full">
                                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Inquiries Tab */}
                <TabsContent value="inquiries" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Inquiries by Month */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Inquiries by Month</CardTitle>
                                <CardDescription>Monthly inquiry trends</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-60 flex items-end gap-2 pt-4">
                                    {analytics.inquiries.monthly.map((item) => (
                                        <div key={item.month} className="flex flex-col items-center flex-1">
                                            <div
                                                className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-colors"
                                                style={{
                                                    height: `${(item.count / Math.max(...analytics.inquiries.monthly.map(i => i.count))) * 180}px`
                                                }}
                                            ></div>
                                            <div className="text-xs font-medium mt-2">{item.month}</div>
                                            <div className="text-xs text-gray-500">{item.count}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Inquiries by Category */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Inquiries by Category</CardTitle>
                                <CardDescription>Distribution across service categories</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.inquiries.byCategory.map((category, index) => (
                                        <div key={category.category} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium">{category.category}</span>
                                                <span>{category.percentage}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full">
                                                <div
                                                    className={`h-full rounded-full ${index === 0 ? "bg-blue-500" :
                                                            index === 1 ? "bg-indigo-500" :
                                                                index === 2 ? "bg-purple-500" :
                                                                    index === 3 ? "bg-green-500" : "bg-yellow-500"
                                                        }`}
                                                    style={{ width: `${category.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Conversion Metrics */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Inquiry Conversion Metrics</CardTitle>
                                <CardDescription>Response and resolution performance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50">
                                        <Clock className="h-8 w-8 text-blue-500 mb-2" />
                                        <h3 className="font-medium text-gray-700 mb-1">Avg. Response Time</h3>
                                        <p className="text-xl font-bold">{analytics.inquiries.conversionTimes.avgResponseTime}</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50">
                                        <Clock className="h-8 w-8 text-indigo-500 mb-2" />
                                        <h3 className="font-medium text-gray-700 mb-1">Avg. Resolution Time</h3>
                                        <p className="text-xl font-bold">{analytics.inquiries.conversionTimes.avgResolutionTime}</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50">
                                        <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                                        <h3 className="font-medium text-gray-700 mb-1">Conversion Rate</h3>
                                        <p className="text-xl font-bold">{analytics.inquiries.conversionTimes.conversionRate}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Analytics