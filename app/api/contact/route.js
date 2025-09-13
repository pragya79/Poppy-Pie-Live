import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectToDatabase from '../../../lib/mongodb';

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

// Email template for contact form submission
const createContactEmailTemplate = (formData) => {
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
            .footer { margin-top: 20px; padding: 15px; background: #f1f3f4; border-radius: 8px; font-size: 14px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>New Contact Form Submission - Poppy Pie</h2>
                <p>You have received a new inquiry through your website contact form.</p>
            </div>
            
            <div class="content">
                <div class="field">
                    <div class="label">Name:</div>
                    <div class="value">${formData.name}</div>
                </div>
                
                <div class="field">
                    <div class="label">Email:</div>
                    <div class="value">${formData.email}</div>
                </div>
                
                <div class="field">
                    <div class="label">Phone:</div>
                    <div class="value">${formData.phone || 'Not provided'}</div>
                </div>
                
                <div class="field">
                    <div class="label">Service Interest:</div>
                    <div class="value">${formData.services || 'Not specified'}</div>
                </div>
                
                <div class="field">
                    <div class="label">Subject:</div>
                    <div class="value">${formData.subject}</div>
                </div>
                
                <div class="field">
                    <div class="label">Message:</div>
                    <div class="value">${formData.message}</div>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
                <p>This email was sent automatically from your website contact form.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Auto-reply template for the customer
const createAutoReplyTemplate = (customerName) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
            .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 8px; margin-top: 20px; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; font-size: 14px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Thank you for contacting Poppy Pie!</h1>
                <p>We've received your message and will get back to you soon.</p>
            </div>
            
            <div class="content">
                <p>Dear ${customerName},</p>
                
                <p>Thank you for reaching out to Poppy Pie! We're excited about the opportunity to work with you and help bring your vision to life.</p>
                
                <p><strong>What happens next?</strong></p>
                <ul>
                    <li>Our team will review your inquiry within 24 hours</li>
                    <li>We'll reach out to schedule a consultation call</li>
                    <li>We'll discuss your project requirements and goals</li>
                    <li>We'll provide you with a customized proposal</li>
                </ul>
                
                <p>In the meantime, feel free to explore our work and services:</p>
                <a href="https://www.thepoppypie.com/our-work" class="cta-button">View Our Portfolio</a>
                
                <p>If you have any urgent questions, don't hesitate to call us directly at <strong>+91 7696834279</strong>.</p>
                
                <p>Best regards,<br>
                <strong>The Poppy Pie Team</strong><br>
                Building brands, Crafting experiences</p>
            </div>
            
            <div class="footer">
                <p><strong>Poppy Pie</strong> - Your Growth, Our Mission</p>
                <p>Email: ${process.env.CONTACT_EMAIL || 'contact@poppypie.com'} | Website: ${process.env.WEBSITE_URL || 'www.poppypie.com'}</p>
                <p>Follow us on social media for the latest updates and insights!</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export async function POST(request) {
    try {
        await connectToDatabase();

        const formData = await request.json();
        const { name, email, phone, services, subject, message } = formData;

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

        // Create transporter
        const transporter = createTransporter();

        // Email to admin
        const adminEmail = process.env.ADMIN_EMAIL || 'contact@poppypie.com';
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: adminEmail, // Use configurable admin email
            subject: `New Contact Form Submission: ${subject}`,
            html: createContactEmailTemplate(formData),
            replyTo: email
        };

        // Auto-reply to customer
        const customerMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting Poppy Pie!',
            html: createAutoReplyTemplate(name)
        };

        // Send emails
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(customerMailOptions)
        ]);

        // Log the submission (you can also save to database if needed)
        console.log('Contact form submission:', {
            name,
            email,
            subject,
            timestamp: new Date().toISOString()
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Your message has been sent successfully! We will get back to you soon.'
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Contact form submission error:', error);

        return NextResponse.json(
            {
                error: 'Failed to send message. Please try again or contact us directly.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        { message: 'Contact API is working. Use POST to submit contact form.' },
        { status: 200 }
    );
}