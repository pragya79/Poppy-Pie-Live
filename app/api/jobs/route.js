import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Job from '../../../models/Job';
import connectToDatabase from '../../../lib/mongodb';

// Database connection helper
async function dbConnect() {
    return await connectToDatabase();
}

export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const includeStats = searchParams.get('includeStats') === 'true';

        // Build query
        const query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const skip = (page - 1) * limit;

        const [jobs, total] = await Promise.all([
            Job.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Job.countDocuments(query)
        ]);

        // Transform data for frontend
        const transformedJobs = jobs.map(job => ({
            ...job,
            id: job._id.toString(),
            _id: job._id.toString(),
        }));

        const response = {
            jobs: transformedJobs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1,
            },
            filters: {
                status,
                category,
                search,
                sortBy,
                sortOrder,
            }
        };

        // Include statistics if requested
        if (includeStats) {
            const [statusStats, categoryStats] = await Promise.all([
                Job.aggregate([
                    { $group: { _id: '$status', count: { $sum: 1 } } }
                ]),
                Job.aggregate([
                    { $group: { _id: '$category', count: { $sum: 1 } } }
                ])
            ]);

            response.stats = {
                byStatus: statusStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {}),
                byCategory: categoryStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {}),
                total
            };
        }

        return NextResponse.json(response);

    } catch (error) {
        console.error('Failed to fetch jobs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await dbConnect();

        const data = await request.json();
        const {
            title,
            slug,
            content,
            featuredImage,
            category,
            tags,
            status,
            author,
            publicUrl,
            requirements,
            responsibilities,
            benefits,
            location,
            employmentType,
            experienceLevel,
            salaryRange,
            applicationDeadline,
            department,
            remoteWork,
            priority
        } = data;

        // Validate required fields
        if (!title || !content || !category) {
            return NextResponse.json(
                { error: 'Title, content, and category are required' },
                { status: 400 }
            );
        }

        // Generate slug if not provided
        let jobSlug = slug;
        if (!jobSlug) {
            jobSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .trim();

            // Ensure uniqueness
            const existingJob = await Job.findOne({ slug: jobSlug });
            if (existingJob) {
                jobSlug = `${jobSlug}-${Date.now()}`;
            }
        }

        // Create new job
        const newJob = new Job({
            title: title.trim(),
            slug: jobSlug,
            content: content.trim(),
            featuredImage: featuredImage || '',
            category: category.trim(),
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
            status: status || 'draft',
            author: author || 'Admin',
            publicUrl: publicUrl || '',
            publishedDate: status === 'published' ? new Date() : null,
            // Additional job-specific fields
            requirements: requirements || [],
            responsibilities: responsibilities || [],
            benefits: benefits || [],
            location: location || '',
            employmentType: employmentType || 'Full-time',
            experienceLevel: experienceLevel || 'Mid Level',
            salaryRange: salaryRange || '',
            applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
            department: department || '',
            remoteWork: remoteWork || false,
            priority: priority || 'medium'
        });

        const savedJob = await newJob.save();

        // Transform for response
        const transformedJob = {
            ...savedJob.toObject(),
            id: savedJob._id.toString(),
            _id: savedJob._id.toString(),
        };

        return NextResponse.json(transformedJob, { status: 201 });

    } catch (error) {
        console.error('Failed to create job:', error);

        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'A job with this slug already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create job' },
            { status: 500 }
        );
    }
}