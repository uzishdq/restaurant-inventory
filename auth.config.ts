import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./lib/schema-validation";
import { isUser } from "./lib/server/data/data-user";

export default {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
        },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        let user = null;
        const validateValues = LoginSchema.safeParse(credentials);

        if (!validateValues.success) {
          return user;
        }

        user = await isUser(validateValues.data);

        if (!user) {
          return null;
        }

        return {
          id: user.idUser,
          name: user.nameUser,
          email: user.username,
          role: user.role,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
