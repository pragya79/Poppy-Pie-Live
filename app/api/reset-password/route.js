import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';

export async function POST(req) {
    try {
        await connectToDatabase();

        const { email, token, password } = await req.json();

        // Validate input
        if (!email || !token || !password) {
            return new Response(JSON.stringify({ message: 'Email, token, and new password are required' }), {
                status: 400,
            });
        }

        // Validate password strength (this will be validated by the model as well)
        if (password.length < 8) {
            return new Response(JSON.stringify({ message: 'Password must be at least 8 characters long' }), {
                status: 400,
            });
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
            return new Response(JSON.stringify({
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            }), {
                status: 400,
            });
        }

        // Find user by email and include the reset token fields
        const user = await User.findOne({ email }).select('+resetPasswordToken +resetPasswordExpiry');

        if (!user) {
            return new Response(JSON.stringify({ message: 'Invalid or expired reset token' }), {
                status: 400,
            });
        }

        // Use the secure token verification method from the model
        const isValidToken = user.verifyPasswordResetToken(token);

        if (!isValidToken) {
            return new Response(JSON.stringify({ message: 'Invalid or expired reset token' }), {
                status: 400,
            });
        }

        // Update the user's password and clear the reset token
        // The password will be automatically hashed by the User model pre-save middleware
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;

        // Reset login attempts if account was locked
        if (user.accountLocked) {
            user.accountLocked = false;
            user.accountLockedUntil = undefined;
            user.loginAttempts = 0;
        }

        await user.save();

        return new Response(JSON.stringify({ message: 'Password reset successfully' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Reset password error:', error);

        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return new Response(JSON.stringify({ message: messages.join(', ') }), {
                status: 400,
            });
        }

        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
        });
    }
}