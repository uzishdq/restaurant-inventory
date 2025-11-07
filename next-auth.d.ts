import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Tambahkan deklarasi module augmentation
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // ⬅️ tambahkan role ke session
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string; // ⬅️ tambahkan role ke user
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string; // ⬅️ tambahkan role ke JWT
  }
}
