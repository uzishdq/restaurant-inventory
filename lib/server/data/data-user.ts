"use server";

import * as z from "zod";
import { LoginSchema } from "@/lib/schema-validation";
import { db } from "@/lib/db";
import { userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { TUser } from "@/lib/type-data";

export const isUser = async (values: z.infer<typeof LoginSchema>) => {
  try {
    const validateValues = LoginSchema.safeParse(values);

    if (!validateValues.success) {
      return null;
    }

    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.username, validateValues.data.username))
      .limit(1);

    if (!user) return null;

    const isValid = await bcrypt.compare(
      validateValues.data.password,
      user.password
    );

    if (!isValid) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPass } = user;

    return userWithoutPass as TUser;
  } catch (error) {
    console.error("error isUser : ", error);
    return null;
  }
};
