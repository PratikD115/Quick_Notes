import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from './../../../../../prisma';
import { hash, compare } from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credential: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Credentials received:", credentials);
        const { email, password } = credentials;

        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          const isValid = await compare(password, existingUser.password);
          if (!isValid) return null;
          return { id: existingUser.id, email: existingUser.email };
        } else {
          // No user? Auto-register them
          const hashedPassword = await hash(password, 10);
          const newUser = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
            },
          });
          return { id: newUser.id, email: newUser.email };
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("User signing in:", user);
      return true;
    },
    async jwt({ token, user }) {
      // Called when the JWT token is created or updated
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        console.log("JWT token created:", token);
      }
      return token;
    },
    async session({ session, token }) {
      // Called when the session is accessed in client components
      session.user.id = token.id;
      console.log("Session data:", session);
      return session;
    },
  },
};

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
