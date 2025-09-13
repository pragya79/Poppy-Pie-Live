import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import JobApplication from '../../../../../models/JobApplication';
import Job from '../../../../../models/Job';
import connectToDatabase from '../../../../../lib/mongodb';
import nodemailer from 'nodemailer';

// Database connection helper
async function dbConnect() {
    return await connectToDatabase();
}

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Email templates
const createApplicationEmailTemplate = (application, job) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; padding: 10px; background: #f8f9fa; border-radius: 4px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>New Job Application - ${job.title}</h2>
                <p>A new application has been submitted for the ${job.title} position.</p>
            </div>
            
            <div class="content">
                <div class="field">
                    <div class="label">Applicant Name:</div>
                    <div class="value">${application.applicantName}</div>
                </div>
                
                <div class="field">
                    <div class="label">Email:</div>
                    <div class="value">${application.email}</div>
                </div>
                
                <div class="field">
                    <div class="label">Phone:</div>
                    <div class="value">${application.phone}</div>
                </div>
                
                <div class="field">
                    <div class="label">Experience:</div>
                    <div class="value">${application.experience}</div>
                </div>
                
                ${application.expectedSalary ? `
                <div class="field">
                    <div class="label">Expected Salary:</div>
                    <div class="value">${application.expectedSalary}</div>
                </div>
                ` : ''}
                
                ${application.coverLetter ? `
                <div class="field">
                    <div class="label">Cover Letter:</div>
                    <div class="value">${application.coverLetter}</div>
                </div>
                ` : ''}
                
                ${application.portfolio ? `
                <div class="field">
                    <div class="label">Portfolio:</div>
                    <div class="value">${application.portfolio}</div>
                </div>
                ` : ''}
                
                ${application.linkedinProfile ? `
                <div class="field">
                    <div class="label">LinkedIn:</div>
                    <div class="value">${application.linkedinProfile}</div>
                </div>
                ` : ''}
            </div>
            
            <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
        </div>
    </body>
    </html>
    `;
};

const createConfirmationEmailTemplate = (applicantName, jobTitle) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
            .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 8px; margin-top: 20px; }
            .footer { margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; font-size: 14px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Application Received!</h1>
                <p>Thank you for applying to Poppy Pie</p>
            </div>
            
            <div class="content">
                <p>Dear ${applicantName},</p>
                
                <p>Thank you for your interest in the <strong>${jobTitle}</strong> position at Poppy Pie. We have successfully received your application and will review it carefully.</p>
                
                <p><strong>What happens next?</strong></p>
                <ul>
                    <li>Our team will review your application within 5-7 business days</li>
                    <li>If your profile matches our requirements, we'll contact you for the next steps</li>
                    <li>We may schedule a phone screening or technical assessment</li>
                    <li>Successful candidates will be invited for interviews</li>
                </ul>
                
                <p>We appreciate the time you've taken to apply and look forward to potentially having you join our team.</p>
                
                <p>Best regards,<br>
                <strong>The Poppy Pie Team</strong><br>
                Building brands, Crafting experiences</p>
            </div>
            
            <div class="footer">
                <p><strong>Poppy Pie</strong> - Your Growth, Our Mission</p>
                <p>Email: careers@thepoppypie.com | Website: www.thepoppypie.com</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export async function POST(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const applicationData = await request.json();

        // Validate job exists
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid job ID' },
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

        // Check if job is still open for applications
        if (job.status !== 'active') {
            return NextResponse.json(
                { error: 'This job is no longer accepting applications' },
                { status: 400 }
            );
        }

        // Check application deadline
        if (job.applicationDeadline && new Date() > new Date(job.applicationDeadline)) {
            return NextResponse.json(
                { error: 'Application deadline has passed' },
                { status: 400 }
            );
        }

        const {
            applicantName,
            email,
            phone,
            resumeUrl,
            coverLetter,
            portfolioUrl,
            linkedinProfile,
            experience,
            expectedSalary,
            availableFrom,
            skills
        } = applicationData;

        // Validate required fields
        if (!applicantName || !email || !phone || !experience) {
            return NextResponse.json(
                { error: 'Name, email, phone, and experience are required' },
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

        // Check for duplicate application
        const existingApplication = await JobApplication.findOne({
            jobId: id,
            email: email.toLowerCase()
        });

        if (existingApplication) {
            return NextResponse.json(
                { error: 'You have already applied for this position' },
                { status: 409 }
            );
        }

        // Create application
        const newApplication = new JobApplication({
            jobId: id,
            jobTitle: job.title,
            applicantName: applicantName.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            resumeUrl,
            coverLetter: coverLetter?.trim(),
            portfolioUrl: portfolioUrl?.trim(),
            linkedinProfile: linkedinProfile?.trim(),
            experience,
            expectedSalary: expectedSalary?.trim(),
            availableFrom: availableFrom ? new Date(availableFrom) : null,
            skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
            source: 'website',
            notes: [{
                note: 'Application submitted through website',
                addedBy: 'system',
                addedAt: new Date(),
            }]
        });

        const savedApplication = await newApplication.save();

        // Send confirmation emails
        try {
            const transporter = createTransporter();

            // Email to admin
            const adminMailOptions = {
                from: process.env.EMAIL_USER,
                to: 'careers@thepoppypie.com',
                subject: `New Application: ${job.title} - ${applicantName}`,
                html: createApplicationEmailTemplate(savedApplication, job),
            };

            // Email to applicant
            const applicantMailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `Application Received - ${job.title} at Poppy Pie`,
                html: createConfirmationEmailTemplate(applicantName, job.title),
            };

            await Promise.all([
                transporter.sendMail(adminMailOptions),
                transporter.sendMail(applicantMailOptions)
            ]);

        } catch (emailError) {
            console.error('Failed to send confirmation emails:', emailError);
            // Don't fail the application if email fails
        }

        // Transform for response
        const transformedApplication = {
            ...savedApplication.toObject(),
            id: savedApplication._id.toString(),
            _id: savedApplication._id.toString(),
        };

        return NextResponse.json({
            success: true,
            message: 'Application submitted successfully',
            application: transformedApplication
        }, { status: 201 });

    } catch (error) {
        console.error('Failed to submit application:', error);
        return NextResponse.json(
            { error: 'Failed to submit application' },
            { status: 500 }
        );
    }
}

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid job ID' },
                { status: 400 }
            );
        }

        // Build query
        const query = { jobId: id };

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { applicantName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;

        const [applications, total] = await Promise.all([
            JobApplication.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            JobApplication.countDocuments(query)
        ]);

        // Transform data
        const transformedApplications = applications.map(app => ({
            ...app,
            id: app._id.toString(),
            _id: app._id.toString(),
        }));

        return NextResponse.json({
            applications: transformedApplications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1,
            }
        });

    } catch (error) {
        console.error('Failed to fetch applications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch applications' },
            { status: 500 }
        );
    }
}