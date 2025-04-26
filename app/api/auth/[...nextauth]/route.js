// app/api/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();

        // Optional: Keep hardcoded admin for testing
        const allowedEmail = "tpoppypie@gmail.com";
        const allowedPassword = "PoppyPie123";

        if (
          credentials?.email === allowedEmail &&
          credentials?.password === allowedPassword
        ) {
          return {
            id: "1",
            name: "Poppy Pie",
            email: allowedEmail,
          };
        }

        // Check database users
        const user = await User.findOne({ email: credentials?.email });
        if (user) {
          const isValid = await bcrypt.compare(
            credentials?.password,
            user.password
          );
          if (isValid) {
            return {
              id: user._id.toString(),
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
            };
          }
        }

        throw new Error("Invalid credentials");
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };