"use server";

import * as z from "zod";
import { eq, or } from "drizzle-orm";
import {
  CreateAccountSchema,
  PasswordUpdateSchema,
  ProfileUpdateSchema,
  RoleUpdateSchema,
  UsernameUpdateSchema,
} from "@/lib/schema-validation";
import { LABEL, tagsUserRevalidate } from "@/lib/constant";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userTable } from "@/lib/db/schema";
import { revalidateTag } from "next/cache";
import bcrypt from "bcryptjs";

export const createAccount = async (
  values: z.infer<typeof CreateAccountSchema>,
) => {
  try {
    const validateValues = CreateAccountSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const session = await auth();

    if (!session?.user.id) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const [isExisting] = await db
      .select({
        username: userTable.username,
        phoneNumber: userTable.phoneNumber,
      })
      .from(userTable)
      .where(
        or(
          eq(userTable.username, validateValues.data.username),
          eq(userTable.phoneNumber, validateValues.data.phoneNumber),
        ),
      )
      .limit(1);

    if (isExisting) {
      if (isExisting.username === validateValues.data.username) {
        return {
          ok: false,
          message: "Username is already taken. Please choose another one.",
        };
      }
      if (isExisting.phoneNumber === validateValues.data.phoneNumber) {
        return {
          ok: false,
          message: "Phone number is already registered.",
        };
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("gangnikmat", 10);

    const [result] = await db
      .insert(userTable)
      .values({
        nameUser: validateValues.data.name,
        username: validateValues.data.username,
        password: hashedPassword,
        phoneNumber: validateValues.data.phoneNumber,
        role: validateValues.data.role,
      })
      .returning();

    //nanti tambah notifikasi ke new user
    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.SAVED,
      };
    }

    const tagsToRevalidate = Array.from(new Set(tagsUserRevalidate));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 })),
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.SAVED,
    };
  } catch (error) {
    console.error("error create account : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updateAccount = async (
  values: z.infer<typeof ProfileUpdateSchema>,
) => {
  try {
    const validateValues = ProfileUpdateSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const session = await auth();

    if (!session?.user.id) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const [result] = await db
      .update(userTable)
      .set({
        nameUser: validateValues.data.name,
        phoneNumber: validateValues.data.phoneNumber,
      })
      .where(eq(userTable.idUser, session.user.id))
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.UPDATE,
      };
    }

    const tagsToRevalidate = Array.from(new Set(tagsUserRevalidate));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 })),
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.UPDATE,
    };
  } catch (error) {
    console.error("error update account : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updateUsername = async (
  values: z.infer<typeof UsernameUpdateSchema>,
) => {
  try {
    const validateValues = UsernameUpdateSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const session = await auth();

    if (!session?.user.id || !session.user.email) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const [isExisting] = await db
      .select({ username: userTable.username })
      .from(userTable)
      .where(eq(userTable.username, validateValues.data.newUsername))
      .limit(1);

    if (isExisting) {
      return {
        ok: false,
        message: "Username sudah digunakan. Silakan pilih username lain.",
      };
    }

    if (session.user.email !== validateValues.data.oldUsername) {
      return {
        ok: false,
        message: "Username saat ini tidak sesuai dengan catatan kami.",
      };
    }

    const [result] = await db
      .update(userTable)
      .set({
        username: validateValues.data.newUsername,
      })
      .where(eq(userTable.idUser, session.user.id))
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.UPDATE,
      };
    }

    const tagsToRevalidate = Array.from(new Set([...tagsUserRevalidate]));

    tagsToRevalidate.forEach((tag) => revalidateTag(tag, { expire: 0 }));

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.UPDATE,
    };
  } catch (error) {
    console.error("error update username : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updatePassword = async (
  values: z.infer<typeof PasswordUpdateSchema>,
) => {
  try {
    const session = await auth();

    if (!session?.user.id) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const validateValues = PasswordUpdateSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const { oldPassword, newPassword } = validateValues.data;

    const [user] = await db
      .select({
        password: userTable.password,
      })
      .from(userTable)
      .where(eq(userTable.idUser, session.user.id))
      .limit(1);

    if (!user) {
      return {
        ok: false,
        message: LABEL.ERROR.SERVER,
      };
    }

    const [isMatchPrev, isSameAsOld, newHashedPassword] = await Promise.all([
      bcrypt.compare(oldPassword, user.password), // Apakah password lama cocok?
      bcrypt.compare(newPassword, user.password), // Apakah password baru sama?
      bcrypt.hash(newPassword, 10),
    ]);

    if (!isMatchPrev) {
      return {
        ok: false,
        message: "Password saat ini salah.",
      };
    }

    if (isSameAsOld) {
      return {
        ok: false,
        message: "Password baru harus berbeda dari password saat ini.",
      };
    }

    const result = await db
      .update(userTable)
      .set({ password: newHashedPassword })
      .where(eq(userTable.idUser, session.user.id))
      .returning();

    if (result.length > 0) {
      const tagsToRevalidate = Array.from(new Set(tagsUserRevalidate));
      await Promise.all(
        tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 })),
      );

      return {
        ok: true,
        message: "Reset password berhasil.",
      };
    } else {
      return {
        ok: false,
        message: "Reset password gagal.",
      };
    }
  } catch (error) {
    console.error("error update password : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updateRole = async (values: z.infer<typeof RoleUpdateSchema>) => {
  try {
    const validateValues = RoleUpdateSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const session = await auth();

    if (!session?.user.id || session?.user.role !== "ADMIN") {
      return {
        ok: false,
        message: LABEL.ERROR.UNAUTHORIZED,
      };
    }

    const [result] = await db
      .update(userTable)
      .set({ role: validateValues.data.role })
      .where(eq(userTable.idUser, validateValues.data.idUser))
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.UPDATE,
      };
    }

    const tagsToRevalidate = Array.from(new Set([...tagsUserRevalidate]));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 })),
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.UPDATE,
    };
  } catch (error) {
    console.error("error update role : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
