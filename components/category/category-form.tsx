"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  CreateCategorySchema,
  DeleteUUIDSchema,
  UpdateCategorySchema,
} from "@/lib/schema-validation";
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
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/server/actions/action-category";
import { TCategory } from "@/lib/type-data";

function CreateCategoryForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof CreateCategorySchema>>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      nameCategory: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof CreateCategorySchema>) => {
    startTransition(() => {
      createCategory(values).then((data) => {
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
            name="nameCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Kategori</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
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

interface IUpdateCategoryForm {
  onSuccess?: () => void;
  data: TCategory;
}

function UpdateCategoryForm({ onSuccess, data }: IUpdateCategoryForm) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof UpdateCategorySchema>>({
    resolver: zodResolver(UpdateCategorySchema),
    defaultValues: {
      idCategory: data.idCategory,
      nameCategory: data.nameCategory,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof UpdateCategorySchema>) => {
    startTransition(() => {
      updateCategory(values).then((data) => {
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
            name="nameCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Kategori</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Loading..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}

function DeleteCategoryForm({ onSuccess, data }: IUpdateCategoryForm) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof DeleteUUIDSchema>>({
    resolver: zodResolver(DeleteUUIDSchema),
    defaultValues: {
      id: data.idCategory,
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof DeleteUUIDSchema>) => {
    startTransition(() => {
      deleteCategory(values).then((data) => {
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
        <div className="space-y-2">
          <FormItem>
            <FormLabel>Nama Kategori</FormLabel>
            <div className="rounded-md border px-3 py-2 text-sm text-gray-700 bg-muted/20">
              {data.nameCategory}
            </div>
          </FormItem>
        </div>
        <Button
          type="submit"
          className="w-full"
          variant="destructive"
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Delete"}
        </Button>
      </form>
    </Form>
  );
}

export { CreateCategoryForm, UpdateCategoryForm, DeleteCategoryForm };
