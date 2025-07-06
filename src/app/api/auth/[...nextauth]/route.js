import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./../../../../../lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        const { email, password } = credentials;

        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          console.log("we found the existing user", existingUser);
          const isValid = await compare(password, existingUser.password);
          if (!isValid) {
            console.log("password not matched and returning null");
            return null;
          }
          return { id: existingUser.id, email: existingUser.email };
        } else {
          console.log('we not foudn the user')
          throw new Error("No user found with this email");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      console.log("Session data:", session);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
