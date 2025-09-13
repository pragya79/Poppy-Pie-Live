import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Inquiry from '../../../../../models/Inquiry';
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

// Email template for inquiry response
const createResponseEmailTemplate = (inquiry, responseText) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
            .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 8px; margin-top: 20px; }
            .original-inquiry { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .response { background: #e3f2fd; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2196f3; }
            .footer { margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; font-size: 14px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Response from Poppy Pie</h1>
                <p>Thank you for your inquiry. Here's our response:</p>
            </div>
            
            <div class="content">
                <p>Dear ${inquiry.name},</p>
                
                <div class="response">
                    <h3>Our Response:</h3>
                    <p>${responseText.replace(/\n/g, '<br>')}</p>
                </div>
                
                <div class="original-inquiry">
                    <h4>Your Original Inquiry:</h4>
                    <p><strong>Subject:</strong> ${inquiry.subject}</p>
                    <p><strong>Message:</strong> ${inquiry.message}</p>
                    <p><strong>Submitted:</strong> ${new Date(inquiry.createdAt).toLocaleDateString()}</p>
                </div>
                
                <p>If you have any follow-up questions or would like to discuss this further, please don't hesitate to reach out to us.</p>
                
                <p>Best regards,<br>
                <strong>The Poppy Pie Team</strong><br>
                Building brands, Crafting experiences</p>
            </div>
            
            <div class="footer">
                <p><strong>Poppy Pie</strong> - Your Growth, Our Mission</p>
                <p>Email: info@thepoppypie.com | Website: www.thepoppypie.com</p>
                <p>Phone: +91 9876543210</p>
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
        const { response: responseText, respondedBy } = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid inquiry ID' },
                { status: 400 }
            );
        }

        if (!responseText || responseText.trim().length === 0) {
            return NextResponse.json(
                { error: 'Response text is required' },
                { status: 400 }
            );
        }

        const inquiry = await Inquiry.findById(id);

        if (!inquiry) {
            return NextResponse.json(
                { error: 'Inquiry not found' },
                { status: 404 }
            );
        }

        // Update inquiry with response
        await inquiry.addResponse(responseText.trim(), respondedBy || 'admin');

        // Send email response
        try {
            const transporter = createTransporter();

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: inquiry.email,
                subject: `Re: ${inquiry.subject}`,
                html: createResponseEmailTemplate(inquiry, responseText),
                replyTo: process.env.EMAIL_USER
            };

            await transporter.sendMail(mailOptions);

            // Add note about email sent
            inquiry.notes.push({
                note: 'Response email sent successfully',
                addedBy: respondedBy || 'admin',
                addedAt: new Date(),
            });

            await inquiry.save();

        } catch (emailError) {
            console.error('Failed to send response email:', emailError);

            // Add note about email failure but don't fail the whole request
            inquiry.notes.push({
                note: 'Failed to send response email - manual follow-up required',
                addedBy: 'system',
                addedAt: new Date(),
            });

            await inquiry.save();

            return NextResponse.json({
                success: true,
                message: 'Response saved but email failed to send. Please contact the customer manually.',
                emailError: true
            });
        }

        // Transform for response
        const transformedInquiry = {
            ...inquiry.toObject(),
            id: inquiry._id.toString(),
            _id: inquiry._id.toString(),
        };

        return NextResponse.json({
            success: true,
            message: 'Response sent successfully',
            inquiry: transformedInquiry
        });

    } catch (error) {
        console.error('Failed to send response:', error);
        return NextResponse.json(
            { error: 'Failed to send response' },
            { status: 500 }
        );
    }
}