import NextAuth from "next-auth";
import { ROUTES } from "./constant";
import authConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET!,
  pages: {
    signIn: ROUTES.PUBLIC.LOGIN,
    signOut: ROUTES.PUBLIC.LOGIN,
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      // Saat login pertama, simpan role ke token
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      // Inject role ke session
      if (token && typeof token.role === "string") {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }
      return session;
    },
  },
  ...authConfig,
});
