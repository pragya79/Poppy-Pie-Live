import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Inquiry from '../../../models/Inquiry';
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
        const limit = parseInt(searchParams.get('limit')) || 50;
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        const assignedTo = searchParams.get('assignedTo');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Build query
        const query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (priority && priority !== 'all') {
            query.priority = priority;
        }

        if (assignedTo && assignedTo !== 'all') {
            query.assignedTo = assignedTo;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } },
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const skip = (page - 1) * limit;

        const [inquiries, total] = await Promise.all([
            Inquiry.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Inquiry.countDocuments(query)
        ]);

        // Transform data for frontend
        const transformedInquiries = inquiries.map(inquiry => ({
            ...inquiry,
            id: inquiry._id.toString(),
            _id: inquiry._id.toString(),
        }));

        return NextResponse.json({
            inquiries: transformedInquiries,
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
                priority,
                assignedTo,
                search,
                sortBy,
                sortOrder,
            }
        });

    } catch (error) {
        console.error('Failed to fetch inquiries:', error);
        return NextResponse.json(
            { error: 'Failed to fetch inquiries' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await dbConnect();

        const data = await request.json();
        const { name, email, phone, subject, message, service, priority, source } = data;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Name, email, subject, and message are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Create new inquiry
        const newInquiry = new Inquiry({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone?.trim(),
            subject: subject.trim(),
            message: message.trim(),
            service: service?.trim(),
            priority: priority || 'medium',
            source: source || 'website',
            notes: [{
                note: 'Inquiry created from website contact form',
                addedBy: 'system',
                addedAt: new Date(),
            }]
        });

        const savedInquiry = await newInquiry.save();

        // Transform for response
        const transformedInquiry = {
            ...savedInquiry.toObject(),
            id: savedInquiry._id.toString(),
            _id: savedInquiry._id.toString(),
        };

        return NextResponse.json(transformedInquiry, { status: 201 });

    } catch (error) {
        console.error('Failed to create inquiry:', error);
        return NextResponse.json(
            { error: 'Failed to create inquiry' },
            { status: 500 }
        );
    }
}