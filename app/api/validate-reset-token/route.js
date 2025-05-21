import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';

export async function POST(req) {
    try {
        await connectToDatabase();

        const { email, token } = await req.json();

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