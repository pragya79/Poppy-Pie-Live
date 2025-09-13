import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectToDatabase from '../../../lib/mongodb';
import Blog from '@/models/Blog';
import Inquiry from '@/models/Inquiry';
import User from '@/models/User';
import Job from '@/models/Job';
import JobApplication from '@/models/JobApplication';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        // Get current date and 30 days ago
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

        // Blog stats
        const totalBlogs = await Blog.countDocuments();
        const publishedBlogs = await Blog.countDocuments({ status: 'published' });
        const draftBlogs = await Blog.countDocuments({ status: 'draft' });
        const recentBlogs = await Blog.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        // Inquiry stats
        const totalInquiries = await Inquiry.countDocuments();
        const pendingInquiries = await Inquiry.countDocuments({ status: 'pending' });
        const inProgressInquiries = await Inquiry.countDocuments({ status: 'in_progress' });
        const resolvedInquiries = await Inquiry.countDocuments({ status: 'resolved' });
        const recentInquiries = await Inquiry.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        // User stats
        const totalUsers = await User.countDocuments();
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const regularUsers = await User.countDocuments({ role: 'user' });
        const recentUsers = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        // Job stats
        const totalJobs = await Job.countDocuments();
        const activeJobs = await Job.countDocuments({ status: 'active' });
        const closedJobs = await Job.countDocuments({ status: 'closed' });
        const recentJobs = await Job.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        // Job Application stats
        const totalApplications = await JobApplication.countDocuments();
        const pendingApplications = await JobApplication.countDocuments({ status: 'pending' });
        const reviewedApplications = await JobApplication.countDocuments({ status: 'reviewed' });
        const shortlistedApplications = await JobApplication.countDocuments({ status: 'shortlisted' });
        const rejectedApplications = await JobApplication.countDocuments({ status: 'rejected' });
        const recentApplications = await JobApplication.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        // Monthly trends (last 6 months)
        const sixMonthsAgo = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000));

        const monthlyStats = await Promise.all([
            // Monthly inquiries
            Inquiry.aggregate([
                {
                    $match: {
                        createdAt: { $gte: sixMonthsAgo }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1 }
                }
            ]),
            // Monthly applications
            JobApplication.aggregate([
                {
                    $match: {
                        createdAt: { $gte: sixMonthsAgo }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1 }
                }
            ])
        ]);

        // Recent activities (last 10 items)
        const recentActivities = [];

        const recentBlogPosts = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .select('title createdAt status');

        const recentInquiriesData = await Inquiry.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .select('name email service createdAt');

        const recentJobApplications = await JobApplication.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('jobId', 'title')
            .select('applicantName jobId createdAt');

        // Format recent activities
        recentBlogPosts.forEach(blog => {
            recentActivities.push({
                type: 'blog',
                title: `New blog post: ${blog.title}`,
                date: blog.createdAt,
                status: blog.status
            });
        });

        recentInquiriesData.forEach(inquiry => {
            recentActivities.push({
                type: 'inquiry',
                title: `New inquiry from ${inquiry.name}`,
                date: inquiry.createdAt,
                email: inquiry.email,
                service: inquiry.service
            });
        });

        recentJobApplications.forEach(application => {
            recentActivities.push({
                type: 'application',
                title: `New application from ${application.applicantName}`,
                date: application.createdAt,
                job: application.jobId?.title
            });
        });

        // Sort activities by date
        recentActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Popular services from inquiries
        const popularServices = await Inquiry.aggregate([
            {
                $group: {
                    _id: "$service",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 5
            }
        ]);

        const analytics = {
            overview: {
                totalBlogs,
                publishedBlogs,
                draftBlogs,
                totalInquiries,
                pendingInquiries,
                totalUsers,
                totalJobs,
                activeJobs,
                totalApplications,
                recentInquiries,
                recentApplications,
                recentBlogs,
                recentJobs,
                recentUsers
            },
            detailedStats: {
                blogs: {
                    total: totalBlogs,
                    published: publishedBlogs,
                    draft: draftBlogs,
                    recent: recentBlogs
                },
                inquiries: {
                    total: totalInquiries,
                    pending: pendingInquiries,
                    inProgress: inProgressInquiries,
                    resolved: resolvedInquiries,
                    recent: recentInquiries
                },
                users: {
                    total: totalUsers,
                    admin: adminUsers,
                    regular: regularUsers,
                    recent: recentUsers
                },
                jobs: {
                    total: totalJobs,
                    active: activeJobs,
                    closed: closedJobs,
                    recent: recentJobs
                },
                applications: {
                    total: totalApplications,
                    pending: pendingApplications,
                    reviewed: reviewedApplications,
                    shortlisted: shortlistedApplications,
                    rejected: rejectedApplications,
                    recent: recentApplications
                }
            },
            trends: {
                monthlyInquiries: monthlyStats[0],
                monthlyApplications: monthlyStats[1]
            },
            recentActivities: recentActivities.slice(0, 10),
            popularServices
        };

        return NextResponse.json(analytics);

    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics data' },
            { status: 500 }
        );
    }
}