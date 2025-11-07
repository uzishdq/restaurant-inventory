"use client";

import * as z from "zod";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { TUser } from "@/lib/type-data";
import {
  PasswordUpdateSchema,
  ProfileUpdateSchema,
  RoleUpdateSchema,
  UsernameUpdateSchema,
} from "@/lib/schema-validation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
import { toast } from "sonner";
import {
  updateAccount,
  updatePassword,
  updateRole,
  updateUsername,
} from "@/lib/server/actions/action-user";
import { signOut } from "next-auth/react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ROLE } from "@/lib/constant";
import { useRouter } from "next/navigation";

interface IAccountForm {
  data: TUser;
}

function AccountForm({ data }: IAccountForm) {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof ProfileUpdateSchema>>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      name: data.nameUser,
      phoneNumber: data.phoneNumber,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof ProfileUpdateSchema>) => {
    startTranssition(() => {
      updateAccount(values).then((data) => {
        if (data.ok) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Make sure your data is correct. If it is already accurate, there is no
          need to edit or change it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
                    {data.username}
                  </div>
                </FormItem>
              </div>

              <div className="space-y-2">
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
                    {data.role}
                  </div>
                </FormItem>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Loading..." : "Update"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function AccountResetPassword() {
  const [showPasswords, setShowPasswords] = React.useState<boolean>(false);
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof PasswordUpdateSchema>>({
    resolver: zodResolver(PasswordUpdateSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newConfirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof PasswordUpdateSchema>) => {
    startTranssition(() => {
      updatePassword(values).then((data) => {
        if (data.ok) {
          form.reset();
          toast.success(data.message);
          setTimeout(() => {
            signOut();
          }, 1500);
        } else {
          toast.error(data.message);
        }
      });
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Enter your current and new password to update your credentials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={showPasswords ? "text" : "password"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type={showPasswords ? "text" : "password"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="newConfirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type={showPasswords ? "text" : "password"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                id="show-password"
                type="checkbox"
                className="h-4 w-4"
                onChange={(e) => setShowPasswords(e.target.checked)}
              />
              <Label htmlFor="show-password" className="text-sm">
                Show password
              </Label>
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Loading..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function AccountResetUsername() {
  const [isPending, startTranssition] = React.useTransition();

  const form = useForm<z.infer<typeof UsernameUpdateSchema>>({
    resolver: zodResolver(UsernameUpdateSchema),
    defaultValues: {
      oldUsername: "",
      newUsername: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof UsernameUpdateSchema>) => {
    startTranssition(() => {
      updateUsername(values).then((data) => {
        if (data.ok) {
          form.reset();
          toast.success(data.message);
          setTimeout(() => {
            signOut();
          }, 1500);
        } else {
          toast.error(data.message);
        }
      });
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Username</CardTitle>
        <CardDescription>
          Enter your current and new username to update your account details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="oldUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Username</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="newUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Username</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Loading..." : "Update Username"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

interface IAccountRoleUpdate {
  data: TUser;
}

function AccountRoleUpdate({ data }: IAccountRoleUpdate) {
  const router = useRouter();

  const form = useForm<z.infer<typeof RoleUpdateSchema>>({
    resolver: zodResolver(RoleUpdateSchema),
    defaultValues: {
      idUser: data.idUser,
      role: data.role,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof RoleUpdateSchema>) => {
    const result = await updateRole(values);

    if (result.ok) {
      form.reset();
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role User</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Role User" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROLE.map((item, index) => (
                      <SelectItem key={index} value={item.value}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Loading..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}

export {
  AccountForm,
  AccountResetPassword,
  AccountResetUsername,
  AccountRoleUpdate,
};
