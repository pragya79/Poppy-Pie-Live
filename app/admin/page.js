// app/admin/page.js
"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Mail,
  FileText,
  TrendingUp,
  Users,
  ArrowUpRight,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/app/components/context/AuthProvider";
import { useRouter } from "next/navigation";
import useAnalytics from "@/app/components/shared/hooks/useAnalytics";

export default function AdminDashboard() {
  const { user, isAuthenticated, loading, isAdmin } = useAuth();
  const router = useRouter();
  const { analytics, loading: analyticsLoading, error: analyticsError, refetch } = useAnalytics();

  // Protect the route
  useEffect(() => {
    console.log("Auth State:", { loading, isAuthenticated, user, isAdmin: isAdmin() });
    if (!loading) {
      if (!isAuthenticated || !isAdmin()) {
        console.log("Redirecting to /login: Not authenticated or not admin");
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, user, isAdmin, router]);

  if (loading || analyticsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Additional check to prevent rendering if not authorized
  if (!isAuthenticated || !isAdmin()) {
    return null;
  }

  // Handle analytics error
  if (analyticsError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to the admin dashboard</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading dashboard data</h3>
            <p className="text-gray-600 mb-4">{analyticsError}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get data from analytics
  const overview = analytics?.overview || {};
  const recentActivities = analytics?.recentActivities || [];

  // Create stats cards with real data
  const statsCards = [
    {
      title: "Total Inquiries",
      value: overview.totalInquiries || 0,
      change: overview.recentInquiries ? `+${overview.recentInquiries}` : "+0",
      trend: "up",
      description: "new this week",
      icon: <Mail className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Blog Posts",
      value: overview.totalBlogs || 0,
      change: overview.recentBlogs ? `+${overview.recentBlogs}` : "+0",
      trend: "up",
      description: "new this week",
      icon: <FileText className="h-5 w-5 text-indigo-500" />,
    },
    {
      title: "Active Jobs",
      value: overview.activeJobs || 0,
      change: overview.recentJobs ? `+${overview.recentJobs}` : "+0",
      trend: "up",
      description: "new this week",
      icon: <Briefcase className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Total Users",
      value: overview.totalUsers || 0,
      change: overview.recentUsers ? `+${overview.recentUsers}` : "+0",
      trend: "up",
      description: "new this week",
      icon: <Users className="h-5 w-5 text-purple-500" />,
    },
  ];

  // Filter recent activities for display
  const recentInquiries = recentActivities
    .filter(activity => activity.type === 'inquiry')
    .slice(0, 4)
    .map((activity, index) => ({
      id: `INQ-${index + 1}`,
      name: activity.title.replace('New inquiry from ', ''),
      email: activity.email || 'N/A',
      date: activity.date,
      subject: activity.service || 'General inquiry',
      status: 'new',
    }));

  const recentBlogPosts = recentActivities
    .filter(activity => activity.type === 'blog')
    .slice(0, 3)
    .map((activity, index) => ({
      id: `POST-${index + 1}`,
      title: activity.title.replace('New blog post: ', ''),
      date: activity.date,
      author: "Admin",
      views: Math.floor(Math.random() * 500) + 100, // Random views for now
      status: activity.status || 'published',
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to the admin dashboard</p>
        </div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          disabled={analyticsLoading}
        >
          <TrendingUp className="h-4 w-4" />
          {analyticsLoading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
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
                <ArrowUpRight
                  className={`h-3 w-3 ${card.trend === "up" ? "text-green-500" : "text-red-500"}`}
                />
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
              {recentInquiries.length > 0 ? (
                recentInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{inquiry.name}</p>
                      <p className="text-xs text-gray-500">{inquiry.subject}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(inquiry.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${inquiry.status === "new" ? "bg-blue-100 text-blue-800" : inquiry.status === "in-progress" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                      >
                        {inquiry.status === "new"
                          ? "New"
                          : inquiry.status === "in-progress"
                            ? "In Progress"
                            : "Completed"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent inquiries</p>
              )}
            </div>
            <button
              className="w-full text-center text-sm text-blue-600 hover:text-blue-800 mt-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => router.push("/admin/inquiries")}
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
              {recentBlogPosts.length > 0 ? (
                recentBlogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{post.title}</p>
                      <p className="text-xs text-gray-500">By {post.author}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">{post.views} views</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent blog posts</p>
              )}
            </div>
            <button
              className="w-full text-center text-sm text-blue-600 hover:text-blue-800 mt-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => router.push("/admin/blog")}
            >
              Manage Blog Posts
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}