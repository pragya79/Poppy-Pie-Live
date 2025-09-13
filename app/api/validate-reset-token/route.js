import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';

export async function POST(req) {
    try {
        await connectToDatabase();

        const { email, token } = await req.json();

        // Validate input
        if (!email || !token) {
            return new Response(JSON.stringify({ message: 'Email and token are required' }), {
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

        return new Response(JSON.stringify({ message: 'Token is valid' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Validate token error:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
        });
    }
}