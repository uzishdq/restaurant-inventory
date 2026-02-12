"use client";

import * as z from "zod";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { TUser } from "@/lib/type-data";
import {
  CreateAccountSchema,
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
  createAccount,
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

interface IAccountForm {
  data: TUser;
}

function AccountForm({ data }: Readonly<IAccountForm>) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof ProfileUpdateSchema>>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      name: data.nameUser,
      phoneNumber: data.phoneNumber,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof ProfileUpdateSchema>) => {
    startTransition(() => {
      updateAccount(values).then((data) => {
        if (data.ok) {
          form.reset();
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
        <CardTitle>Informasi Akun</CardTitle>
        <CardDescription>
          Periksa kembali data akun Anda. Jika sudah benar, tidak perlu
          melakukan pengeditan.
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
                      <FormLabel>Nama</FormLabel>
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
                      <FormLabel>No. Telp</FormLabel>
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

function CreateAccountForm({
  onSuccess,
}: Readonly<{ onSuccess?: () => void }>) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof CreateAccountSchema>>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      name: "",
      username: "",
      phoneNumber: "",
      role: "HEADKITCHEN",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof CreateAccountSchema>) => {
    startTransition(() => {
      createAccount(values).then((data) => {
        if (data.ok) {
          form.reset();
          onSuccess?.();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
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
                <FormLabel>No.Telp</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
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
                      <SelectItem
                        key={`role-${index}-${item.name}`}
                        value={item.value}
                      >
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
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Loading..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}

function AccountResetPassword() {
  const [showPasswords, setShowPasswords] = React.useState<boolean>(false);
  const [isPending, startTransition] = React.useTransition();

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
    startTransition(() => {
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
        <CardTitle>Ubah Password</CardTitle>
        <CardDescription>
          Masukkan password saat ini dan password baru untuk memperbarui
          keamanan akun Anda.
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
                    <FormLabel>Password saat ini</FormLabel>
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
                      <FormLabel>Password baru</FormLabel>
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
                      <FormLabel>Konfirmasi Password Baru</FormLabel>
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
                Tampilkan password
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
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof UsernameUpdateSchema>>({
    resolver: zodResolver(UsernameUpdateSchema),
    defaultValues: {
      oldUsername: "",
      newUsername: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof UsernameUpdateSchema>) => {
    startTransition(() => {
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
        <CardTitle>Ubah Username</CardTitle>
        <CardDescription>
          Masukkan username saat ini dan username baru untuk memperbarui
          informasi akun Anda.
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
                      <FormLabel>Username Saat ini</FormLabel>
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
                      <FormLabel>Username Baru</FormLabel>
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
  onSuccess?: () => void;
  data: TUser;
}

function AccountRoleUpdate({ onSuccess, data }: Readonly<IAccountRoleUpdate>) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof RoleUpdateSchema>>({
    resolver: zodResolver(RoleUpdateSchema),
    defaultValues: {
      idUser: data.idUser,
      role: data.role,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof RoleUpdateSchema>) => {
    startTransition(() => {
      updateRole(values).then((data) => {
        if (data.ok) {
          onSuccess?.();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
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
                      <SelectItem
                        key={`role-${index}-${item.name}`}
                        value={item.value}
                      >
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
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Loading..." : "Update"}
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
  CreateAccountForm,
};
