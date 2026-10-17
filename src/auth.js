import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise, { databaseName: 'webdev-mentor-ai' }),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }
      
      // Overwrite session token identity safely ONLY on initial sign-in
      if (account && profile) {
        const providerName = profile.name || profile.login || (user ? user.name : null);
        const providerImage = profile.picture || profile.avatar_url || (user ? user.image : null);
        
        if (providerName) token.name = providerName;
        if (providerImage) token.picture = providerImage;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        // token.name and token.picture are automatically mapped by Auth.js 
        // to session.user.name and session.user.image, requiring no custom UI properties.
      }
      return session;
    }
  }
})
