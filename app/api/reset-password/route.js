import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        await connectToDatabase();

        const { email, token, password } = await req.json();

        const user = await User.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return new Response(JSON.stringify({ message: 'Invalid or expired reset token' }), {
                status: 400,
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update the user's password and clear the reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        return new Response(JSON.stringify({ message: 'Password reset successfully' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
        });
    }
}