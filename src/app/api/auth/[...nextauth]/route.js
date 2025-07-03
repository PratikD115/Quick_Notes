import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("User signing in:", user)
      return true
    },
    async jwt({ token, user }) {
      // Called when the JWT token is created or updated
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
        console.log("JWT token created:", token)
      }
      return token
    },
    async session({ session, token }) {
      // Called when the session is accessed in client components
      session.user.id = token.id
      console.log("Session data:", session)
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
