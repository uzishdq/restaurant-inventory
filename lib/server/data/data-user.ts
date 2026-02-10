"use server";

import * as z from "zod";
import {
  IdSchema,
  LoginSchema,
  NotificationRoleSchema,
} from "@/lib/schema-validation";
import { db } from "@/lib/db";
import { userTable } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { roleType, TUser, TUserNumber } from "@/lib/type-data";
import { unstable_cache } from "next/cache";

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
      user.password,
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

export const getAccount = unstable_cache(
  async (idUser: string) => {
    try {
      const validateValues = IdSchema.safeParse({ id: idUser });

      if (!validateValues.success) {
        return { ok: false, data: null };
      }

      const [result] = await db
        .select({
          idUser: userTable.idUser,
          nameUser: userTable.nameUser,
          username: userTable.username,
          phoneNumber: userTable.phoneNumber,
          role: userTable.role,
          createdAt: userTable.createdAt,
        })
        .from(userTable)
        .where(eq(userTable.idUser, idUser))
        .limit(1);

      if (!result) {
        return { ok: true, data: null };
      } else {
        return { ok: true, data: result as TUser };
      }
    } catch (error) {
      console.error("error account data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-account"],
  {
    tags: ["get-account"],
  },
);

export const getUsers = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          idUser: userTable.idUser,
          nameUser: userTable.nameUser,
          username: userTable.username,
          phoneNumber: userTable.phoneNumber,
          role: userTable.role,
          createdAt: userTable.createdAt,
        })
        .from(userTable)
        .orderBy(asc(userTable.createdAt));

      if (result.length > 0) {
        return { ok: true, data: result as TUser[] };
      } else {
        return { ok: true, data: [] as TUser[] };
      }
    } catch (error) {
      console.error("error user data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-users"],
  {
    tags: ["get-users"],
  },
);

export const getUsersNumberByRole = unstable_cache(
  async (role: roleType) => {
    try {
      const validateValues = NotificationRoleSchema.safeParse({ role });

      if (!validateValues.success) {
        return { ok: false, data: null };
      }

      const result = await db
        .select({
          idUser: userTable.idUser,
          nameUser: userTable.nameUser,
          phoneNumber: userTable.phoneNumber,
          role: userTable.role,
        })
        .from(userTable)
        .orderBy(asc(userTable.createdAt));

      if (result.length > 0) {
        return { ok: true, data: result as TUserNumber[] };
      } else {
        return { ok: true, data: [] as TUserNumber[] };
      }
    } catch (error) {
      console.error("error user number data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-users-numberByRole"],
  {
    tags: ["get-users-numberByRole"],
  },
);
