// app/api/register/route.js
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectToDatabase();

    const { firstName, lastName, email, mobile, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), {
        status: 400,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      mobile,
      password: hashedPassword,
    });

    await user.save();

    return new Response(JSON.stringify({ success: true, message: 'User registered successfully' }), {
      status: 201,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}