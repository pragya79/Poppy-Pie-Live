import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Job from '../../../../models/Job';
import connectToDatabase from '../../../../lib/mongodb';

// Database connection helper
async function dbConnect() {
    return await connectToDatabase();
}

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid job ID' },
                { status: 400 }
            );
        }

        const job = await Job.findById(id).lean();

        if (!job) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            );
        }

        // Transform for response
        const transformedJob = {
            ...job,
            id: job._id.toString(),
            _id: job._id.toString(),
        };

        return NextResponse.json(transformedJob);

    } catch (error) {
        console.error('Failed to fetch job:', error);
        return NextResponse.json(
            { error: 'Failed to fetch job' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const updates = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid job ID' },
                { status: 400 }
            );
        }

        const {
            title,
            slug,
            content,
            featuredImage,
            category,
            tags,
            status,
            author,
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
        } = updates;

        if (!title || !content || !category) {
            return NextResponse.json(
                { error: 'Title, content, and category are required' },
                { status: 400 }
            );
        }

        const job = await Job.findById(id);

        if (!job) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            );
        }

        // Update job fields
        job.title = title.trim();
        job.slug = slug || job.slug;
        job.content = content.trim();
        job.featuredImage = featuredImage || '';
        job.category = category.trim();
        job.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []);
        job.status = status || job.status;
        job.author = author || job.author;

        // Job-specific fields
        if (requirements !== undefined) job.requirements = requirements;
        if (responsibilities !== undefined) job.responsibilities = responsibilities;
        if (benefits !== undefined) job.benefits = benefits;
        if (location !== undefined) job.location = location;
        if (employmentType !== undefined) job.employmentType = employmentType;
        if (experienceLevel !== undefined) job.experienceLevel = experienceLevel;
        if (salaryRange !== undefined) job.salaryRange = salaryRange;
        if (department !== undefined) job.department = department;
        if (remoteWork !== undefined) job.remoteWork = remoteWork;
        if (priority !== undefined) job.priority = priority;
        if (applicationDeadline !== undefined) {
            job.applicationDeadline = applicationDeadline ? new Date(applicationDeadline) : null;
        }

        // Update published date if status changed to published
        if (status === 'published' && job.status !== 'published') {
            job.publishedDate = new Date();
        }

        const updatedJob = await job.save();

        // Transform for response
        const transformedJob = {
            ...updatedJob.toObject(),
            id: updatedJob._id.toString(),
            _id: updatedJob._id.toString(),
        };

        return NextResponse.json(transformedJob);

    } catch (error) {
        console.error('Failed to update job:', error);

        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'A job with this slug already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update job' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid job ID' },
                { status: 400 }
            );
        }

        const job = await Job.findByIdAndDelete(id);

        if (!job) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            );
        }

        return new NextResponse(null, { status: 204 });

    } catch (error) {
        console.error('Failed to delete job:', error);
        return NextResponse.json(
            { error: 'Failed to delete job' },
            { status: 500 }
        );
    }
}