import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req) {
    try {
        await connectToDatabase();

        const { email } = await req.json();

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ message: 'User with this email does not exist' }), {
                status: 404,
            });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

        // Save the token and expiry to the user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetTokenExpiry;
        await user.save();

        // Send the reset email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour. If you did not request this, please ignore this email.`,
        };

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: 'Password reset link sent successfully' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
        });
    }
}