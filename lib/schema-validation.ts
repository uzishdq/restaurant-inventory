import z from "zod";

export const username = z
  .string()
  .min(5, "Username must be at least 5 characters long.")
  .max(50, "Username must not exceed 50 characters.")
  .refine((username) => !/\s/.test(username), {
    message: "tidak boleh menggandung spasi",
  });

export const password = z
  .string()
  .min(6, "Password must be at least 6 characters long.")
  .max(50, "Password must not exceed 50 characters.");

/* -------- AUTH --------  */
export const LoginSchema = z.object({
  username: username,
  password: password,
});
