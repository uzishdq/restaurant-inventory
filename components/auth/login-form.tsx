"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/schema-validation";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constant";
import FormStatus from "./form-status";

export default function LoginForm() {
  const [message, setMessage] = React.useState<string | undefined>("");
  const [status, setStatus] = React.useState<boolean | undefined>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    return await signIn("credentials", {
      redirect: false,
      username: values.username,
      password: values.password,
    })
      .then((data) => {
        if (data?.error) {
          setStatus(false);
          setMessage("Username atau password salah.");
        } else {
          setStatus(true);
          setMessage("Berhasil login.");
          form.reset();
          router.push(ROUTES.AUTH.DASHBOARD);
        }
      })
      .catch((err) => {
        setStatus(false);
        setMessage("Terjadi kesalahan saat login. Silakan coba lagi nanti.");
        console.error(err);
      });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Selamat Datang</CardTitle>
        <CardDescription>
          Masukkan nama pengguna Anda di bawah ini untuk masuk ke akun Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormStatus status={status} message={message} />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="******" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Loading..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
